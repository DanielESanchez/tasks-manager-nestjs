import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UserRoleGuard } from './role.guard';
import { ExecutionContext, ForbiddenException, BadRequestException } from '@nestjs/common';
import { META_ROLES } from '../decorators/role-protected.decorator';

describe('UserRoleGuard', () => {
  let userRoleGuard: UserRoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRoleGuard,
        Reflector,
      ],
    }).compile();

    userRoleGuard = module.get<UserRoleGuard>(UserRoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(userRoleGuard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when valid roles are not defined', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(undefined);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { roles: ['user'] } }),
        }),
        getHandler: () => undefined,
      } as ExecutionContext;

      const result = userRoleGuard.canActivate(context);

      expect(result).toEqual(true);
      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, context.getHandler());
    });

    it('should return true when valid roles are an empty array', () => {
      jest.spyOn(reflector, 'get').mockReturnValue([]);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { roles: ['user'] } }),
        }),
        getHandler: () => undefined,
      } as ExecutionContext;

      const result = userRoleGuard.canActivate(context);

      expect(result).toEqual(true);
      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, context.getHandler());
    });

    it('should throw BadRequestException when user is not found', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({}),
        }),
        getHandler: () => undefined,
      } as ExecutionContext;

      expect(() => userRoleGuard.canActivate(context)).toThrow(BadRequestException);
      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, context.getHandler());
    });

    it('should throw ForbiddenException when user does not have valid roles', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { roles: ['user'] } }),
        }),
        getHandler: () => undefined,
      } as ExecutionContext;

      expect(() => userRoleGuard.canActivate(context)).toThrow(ForbiddenException);
      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, context.getHandler());
    });

    it('should return true when user has valid roles', () => {
      jest.spyOn(reflector, 'get').mockReturnValue(['admin']);

      const context: ExecutionContext = {
        switchToHttp: () => ({
          getRequest: () => ({ user: { roles: ['admin'] } }),
        }),
        getHandler: () => undefined,
      } as ExecutionContext;

      const result = userRoleGuard.canActivate(context);

      expect(result).toEqual(true);
      expect(reflector.get).toHaveBeenCalledWith(META_ROLES, context.getHandler());
    });
  });
});
