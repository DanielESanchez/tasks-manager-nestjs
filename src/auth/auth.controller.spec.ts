import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";
import { User } from "./entities/user.entity";

jest.mock("./auth.service");
jest.mock("@nestjs/jwt");

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const createUserDto: CreateUserDto = {
        email: "test@example.com",
        password: "Test1234",
        fullName: "Test User",
      };

      jest
        .spyOn(authService, "create")
        .mockResolvedValue({ token: "mockedToken" });

      const result = await authController.createUser(createUserDto);

      expect(result).toEqual({ token: "mockedToken" });
      expect(authService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe("loginUser", () => {
    it("should login a user", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "Test1234",
      };

      const user = new User();
      jest
        .spyOn(authService, "login")
        .mockResolvedValue({ ...user, token: "mockedToken" });

      const result = await authController.loginUser(loginUserDto);

      expect(result).toEqual({ token: "mockedToken" });
      expect(authService.login).toHaveBeenCalledWith(loginUserDto);
    });

    it("should handle unauthorized login attempts", async () => {
      const loginUserDto: LoginUserDto = {
        email: "test@example.com",
        password: "Test1234",
      };

      jest
        .spyOn(authService, "login")
        .mockRejectedValue(new UnauthorizedException());

      await expect(authController.loginUser(loginUserDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
