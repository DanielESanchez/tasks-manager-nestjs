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

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @Auth()
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User) {
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.tasksService.findAll();
  }

  @Get("user")
  @Auth()
  findAllForUser(@GetUser() user: User) {
    return this.tasksService.findAllTasksForUser(user);
  }

  @Get("search")
  @Auth()
  findByFilter(@Query("q") query: string, @GetUser() user: User) {
    return this.tasksService.filterTask(query, user);
  }

  @Get(":id")
  findOne(@Param("id", ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(":id")
  @Auth()
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ) {
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Delete(":id")
  @Auth()
  remove(@Param("id", ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.tasksService.remove(id, user);
  }
}
