import { Test, TestingModule } from "@nestjs/testing";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { User } from "src/auth/entities/user.entity";
import { PassportModule } from "@nestjs/passport";
import { Task } from "./entities/task.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

jest.mock("./tasks.service");

describe("TasksController", () => {
  let controller: TasksController;
  let tasksService: TasksService;
  const userMock = new User();
  userMock.id = "1";
  userMock.email = "user@test.test";
  userMock.password = "password";
  userMock.fullName = "Test user";
  userMock.isActive = true;
  userMock.roles = ["user"];

  const taskMock: Task = new Task();
  taskMock.id = "1";
  taskMock.name = "Task Mock";
  taskMock.description = "Description Mock";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [TasksService],
      imports: [
        PassportModule.register({ defaultStrategy: "jwt" }), // Ensure PassportModule is imported
        JwtModule.register({
          
        }),
        ConfigModule,
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    tasksService = module.get<TasksService>(TasksService);
  });

  describe("create", () => {
    it("should create a task", async () => {
      const createTaskDto: CreateTaskDto = {
        name: "Test task",
        description: "Test Description",
      };

      taskMock.name = createTaskDto.name;
      taskMock.description = createTaskDto.description;
      jest.spyOn(tasksService, "create").mockResolvedValue(taskMock);

      const result = await controller.create(createTaskDto, userMock);

      expect(result).toBeDefined();
      expect(tasksService.create).toHaveBeenCalledWith(createTaskDto, userMock);
    });
  });

  describe("findAll", () => {
    it("should get all tasks for admin", async () => {
      jest.spyOn(tasksService, "findAll").mockResolvedValue([taskMock]);
      const result = await controller.findAll();
      expect(result).toBeDefined();
      expect(tasksService.findAll).toHaveBeenCalled();
    });
  });

  describe("findAllForUser", () => {
    it("should get all tasks for a user", async () => {
      jest
        .spyOn(tasksService, "findAllTasksForUser")
        .mockResolvedValue([taskMock]);
      const result = await controller.findAllForUser(userMock);

      expect(result).toBeDefined();
      expect(tasksService.findAllTasksForUser).toHaveBeenCalledWith(userMock);
    });
  });

  describe("findByFilter", () => {
    it("should filter tasks by query", async () => {
      const query = "searchQuery";

      jest.spyOn(tasksService, "filterTask").mockResolvedValue([taskMock]);
      const result = await controller.findByFilter(query, userMock);

      expect(result).toBeDefined();
      expect(tasksService.filterTask).toHaveBeenCalledWith(query, userMock);
    });
  });

  describe("findOne", () => {
    it("should find a task by id", async () => {
      const taskId = "123";

      jest.spyOn(tasksService, "findOne").mockResolvedValue(taskMock);
      const result = await controller.findOne(taskId);

      expect(result).toBeDefined();
      expect(tasksService.findOne).toHaveBeenCalledWith(taskId);
    });
  });

  describe("update", () => {
    it("should update a task", async () => {
      const taskId = "123";
      const updateTaskDto: UpdateTaskDto = {
        name: "Updated Title",
        description: "Updated Description",
      };
      const taskMockUpdated = taskMock;
      taskMockUpdated.name = updateTaskDto.name;
      taskMockUpdated.description = updateTaskDto.description;

      jest.spyOn(tasksService, "update").mockResolvedValue(taskMockUpdated);
      const result = await controller.update(taskId, updateTaskDto, userMock);

      expect(result).toBeDefined();
      expect(result).toEqual(taskMockUpdated);
      expect(tasksService.update).toHaveBeenCalledWith(
        taskId,
        updateTaskDto,
        userMock
      );
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const taskId = '123';

      jest.spyOn(tasksService, 'remove').mockResolvedValue(taskMock);
      const result = await controller.remove(taskId, userMock);

      expect(result).toBeDefined();
      expect(result).toEqual(taskMock);
      expect(tasksService.remove).toHaveBeenCalledWith(taskId, userMock);
    });
  });
});
