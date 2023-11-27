import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Auth, GetUser } from "src/auth/decorators";
import { User } from "src/auth/entities/user.entity";
import { ValidRoles } from "src/auth/interfaces";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";
import { Task } from "./entities/task.entity";
import { ErrorResponse } from "src/common/error-response.entity";
import { ErrorResponseBadRequest } from "src/common/error-response-bad.entity";

@ApiTags("tasks")
@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Auth()
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: "Task saved", type: Task })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "Not authenticated or token invalid",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning all tasks saved",
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  findAll() {
    return this.tasksService.findAll();
  }

  @Get("user")
  @Auth()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning all tasks saved for user authenticated",
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  findAllForUser(@GetUser() user: User) {
    return this.tasksService.findAllTasksForUser(user);
  }

  @Get("search")
  @Auth()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning all tasks saved for user authenticated",
    type: Task,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  findByFilter(@Query("q") query: string, @GetUser() user: User) {
    return this.tasksService.filterTask(query, user);
  }

  @Get(":id")
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning task for id in path",
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  @Auth()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning task updated for id in path",
    type: Task,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(":id")
  @Auth()
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Returning task deleted for id in path",
    type: Task,
  })
  @ApiBadRequestResponse({
    description: "Parameters does not match with the required schema",
    type: ErrorResponseBadRequest,
  })
  @ApiUnauthorizedResponse({
    description: "User not authenticated or invalid token",
    type: ErrorResponse,
  })
  @ApiForbiddenResponse({
    description: "User with invalid roles",
    type: ErrorResponse,
  })
  @ApiNotFoundResponse({
    description: "User not found",
    type: ErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal Error",
    type: ErrorResponse,
  })
  remove(@Param("id", ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}
