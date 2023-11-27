import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UnauthorizedException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: Repository<User>;
  const userMockActive = new User();
  userMockActive.id = "1";
  userMockActive.email = "user@test.test";
  userMockActive.password = "password";
  userMockActive.fullName = "Test user";
  userMockActive.isActive = true;
  userMockActive.roles = ["user"];

  const mockConfigService = {
    get: jest.fn().mockReturnValue('S3cret0AUsa4EnF1rmaD3Jw7Tok3ns')
  };

  class RepositoryMock<T> {
    private data: T[] = [];
  
    async findOneBy(): Promise<T> {
      return this.data[0];
    }

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PassportModule],
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(User),
          useClass: RepositoryMock,
        },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(jwtStrategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user if valid token', async () => {
      const payload: JwtPayload = { id: 'user_id' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(userMockActive);

      const result = await jwtStrategy.validate(payload);

      expect(result).toEqual(userMockActive);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const payload: JwtPayload = { id: 'nonexistent_user_id' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const payload: JwtPayload = { id: 'user_id' };
      const inactiveUser = new User();
      inactiveUser.isActive = false;
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(inactiveUser);

      await expect(jwtStrategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id: payload.id });
    });
  });
});