import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { ErrorResponse } from "src/common/error-response.entity";
import { TokenResponse } from "src/common/token-respnse.entity";
import { ErrorResponseBadRequest } from "src/common/error-response-bad.entity";

class Token {
  token: string;
}

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiCreatedResponse({
    description: "User created",
    type: TokenResponse,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal error",
    type: ErrorResponse,
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post("login")
  @ApiOkResponse({
    description: "User logged in",
    type: TokenResponse,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "Email or password invalid",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal error",
    type: ErrorResponse,
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
}
