import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import {
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from "bcryptjs";

class RepositoryMock<T> {
  private data: T[] = [];

  async create(entity: T): Promise<T> {
    this.data.push(entity);
    return entity;
  }

  async save(entity: T): Promise<T> {
    return entity;
  }

  async findOne(): Promise<T> {
    return this.data[0];
  }
}

class JwtServiceMock {
  sign(payload: any): string {
    return "mockedToken";
  }
}

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: RepositoryMock,
        },
        {
          provide: JwtService,
          useClass: JwtServiceMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe("create", () => {
    it("should create a new user and return a token", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "Test1234",
        fullName: "Test User",
      };

      const result = await authService.create(createUserDto);

      expect(result).toEqual({ token: "mockedToken" });
    });

    it("should handle errors during user creation", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "Test1234",
        fullName: "Test User",
      };

      jest.spyOn(userRepository, "create").mockImplementation(() => {
        throw { code: "23505", detail: "Duplicate key" };
      });

      await expect(authService.create(createUserDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe("login", () => {
    it("should login a user and return a token", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "Test1234",
      };

      const userMock = new User();
      userMock.id = "1";
      userMock.email = loginUserDto.email;
      userMock.password = bcrypt.hashSync(loginUserDto.password, 10);
      userMock.fullName = "Test user";
      userMock.isActive = true;
      userMock.roles = ["user"];

      jest.spyOn(userRepository, "findOne").mockResolvedValue(userMock);

      const result = await authService.login(loginUserDto);

      expect(result).toEqual({
        token: "mockedToken"
      });
    });

    it("should handle unauthorized login attempts", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "Test1234",
      };

      jest.spyOn(userRepository, "findOne").mockResolvedValue(undefined);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should handle unauthorized login password", async () => {
        const loginUserDto: LoginUserDto = {
          email: "test@example.com",
          password: "Test1234",
        };
  
        const userMock = new User();
        userMock.id = "1";
        userMock.email = loginUserDto.email;
        userMock.password = loginUserDto.password;
        userMock.fullName = "Test user";
        userMock.isActive = true;
        userMock.roles = ["user"];
  
        jest.spyOn(userRepository, "findOne").mockResolvedValue(userMock);

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        UnauthorizedException
      );
    });

    it("should handle errors during user login", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "Test1234",
      };

      jest.spyOn(userRepository, "findOne").mockImplementation(() => {
        throw new InternalServerErrorException("Some error occurred");
      });

      await expect(authService.login(loginUserDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
