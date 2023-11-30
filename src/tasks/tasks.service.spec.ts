import { Test, TestingModule } from "@nestjs/testing";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Task } from "./entities/task.entity";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ILike } from "typeorm";
import { User } from "src/auth/entities/user.entity";
import { getRepositoryToken } from "@nestjs/typeorm";

class RepositoryMock<T> {
  private data: T[] = [];

  async create(entity: T): Promise<T> {
    this.data.push(entity);
    return entity;
  }

  async save(entity: T): Promise<T> {
    return entity;
  }

  async preload(entity: T): Promise<T> {
    return entity;
  }

  async find(): Promise<T[]> {
    return this.data;
  }

  async findOne(): Promise<T> {
    return this.data[0];
  }

  async findOneBy(): Promise<T> {
    return this.data[0];
  }

  async remove(): Promise<T> {
    return this.data[0];
  }
}

describe("TasksService", () => {
  let service: TasksService;
  let taskRepo: Repository<Task>;

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
  taskMock.user = userMock;
  taskMock.startDate = new Date()
  taskMock.dueDate = new Date()
  taskMock.completedDate = new Date()
  taskMock.createdDate = new Date()
  taskMock.updatedDate = new Date()


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useClass: RepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    taskRepo = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a task", async () => {
      const createTaskDto: CreateTaskDto = {
        name: "Task 1",
        description: "Description 1",
      };

      const result = await service.create(createTaskDto, userMock);

      expect(result).toEqual({ ...createTaskDto, user: userMock });
    });
  });

  describe("findAll", () => {
    it("should return an array of tasks", async () => {
      const tasks = [{ name: "Task 1" }, { name: "Task 2" }] as Task[];

      jest.spyOn(taskRepo, "find").mockResolvedValue(tasks);

      const result = await service.findAll();

      expect(result).toEqual(tasks);
      expect(taskRepo.find).toHaveBeenCalledWith({});
    });
  });

  describe("findOne", () => {
    it("should return a task by ID", async () => {
      const taskId = "task_id";
      const task = { id: taskId, name: "Task 1" } as Task;

      jest.spyOn(taskRepo, "findOneBy").mockResolvedValue(task);

      const result = await service.findOne(taskId);

      expect(result).toEqual(task);
      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: taskId });
    });

    it("should throw NotFoundException if task is not found", async () => {
      const taskId = "nonexistent_id";

      jest.spyOn(taskRepo, "findOneBy").mockResolvedValue(undefined);

      await expect(service.findOne(taskId)).rejects.toThrow(NotFoundException);
      expect(taskRepo.findOneBy).toHaveBeenCalledWith({ id: taskId });
    });
  });

  describe("update", () => {
    it("should update a task", async () => {
      const taskId = "task_id";
      const updateTaskDto: UpdateTaskDto = {
        name: "Updated Task",
        description: "Updated Description",
      };
      const taskMockUpdated = taskMock;
      taskMockUpdated.name = updateTaskDto.name;
      taskMock.description = updateTaskDto.description;

      jest.spyOn(taskRepo, "findOne").mockResolvedValue(taskMock);
      jest.spyOn(taskRepo, "preload").mockResolvedValue(taskMock);
      jest.spyOn(taskRepo, "save").mockResolvedValue(taskMockUpdated);
      jest.spyOn(service, "findOne").mockResolvedValue(taskMock);

      const result = await service.update(taskId, updateTaskDto, userMock);

      expect(result).toEqual(taskMockUpdated);
      expect(taskRepo.preload).toHaveBeenCalledWith({
        id: taskId,
        ...updateTaskDto,
      });
      expect(taskRepo.save).toHaveBeenCalledWith(taskMock);
      expect(service.findOne).toHaveBeenCalledWith(taskId);
    });

    it("should throw NotFoundException if task is not found", async () => {
      const taskId = "nonexistent_id";
      const updateTaskDto: UpdateTaskDto = {
        name: "Updated Task",
        description: "Updated Description",
      };

      jest.spyOn(taskRepo, "preload").mockResolvedValue(undefined);

      await expect(
        service.update(taskId, updateTaskDto, userMock)
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw UnauthorizedException if task id is different", async () => {
      const taskId = "task_not";
      const updateTaskDto: UpdateTaskDto = {
        name: "Updated Task",
        description: "Updated Description",
      };

      const userMockDifferent = new User();
      userMockDifferent.id = "different";

      const taskMockDifferentUser: Task = new Task();
      taskMockDifferentUser.id = "1";
      taskMockDifferentUser.name = "Task Mock";
      taskMockDifferentUser.description = "Description Mock";
      taskMockDifferentUser.user = userMockDifferent;

      jest.spyOn(taskRepo, "findOne").mockResolvedValue(taskMockDifferentUser);
      jest.spyOn(taskRepo, "preload").mockResolvedValue(taskMock);
      await expect(
        service.update(taskId, updateTaskDto, userMock)
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const taskId = 'task_id';

      jest.spyOn(taskRepo, "findOne").mockResolvedValue(taskMock);
      jest.spyOn(taskRepo, "preload").mockResolvedValue(taskMock);
      jest.spyOn(service, "findOne").mockResolvedValue(taskMock);
      jest.spyOn(taskRepo, 'remove').mockResolvedValue(taskMock);

      const result = await service.remove(taskId, userMock);

      expect(result).toEqual(taskMock);
      expect(service.findOne).toHaveBeenCalledWith(taskId);
      expect(taskRepo.remove).toHaveBeenCalledWith(taskMock);
    });

  });

  describe('filterTask', () => {
    it('should return tasks by name including value to search', async () => {
      const searchString = 'search';

      const tasks = [{ name: 'Task 1' }, { name: 'Task 2' }] as Task[];

      jest.spyOn(taskRepo, 'find').mockResolvedValue(tasks);

      const result = await service.filterTask(searchString, userMock);

      expect(result).toEqual(tasks);
      expect(taskRepo.find).toHaveBeenCalledWith({
        where: [
          { description: ILike(`%${searchString}%`), user: { id: userMock.id } },
          { name: ILike(`%${searchString}%`), user: { id: userMock.id } },
        ],
      });
    });
  });

  describe('findAllTasksForUser', () => {
    it('should return all tasks for a user', async () => {

      const tasks = [{ name: 'Task 1' }, { name: 'Task 2' }] as Task[];

      jest.spyOn(taskRepo, 'find').mockResolvedValue(tasks);

      const result = await service.findAllTasksForUser(userMock);

      expect(result).toEqual(tasks);
      expect(taskRepo.find).toHaveBeenCalledWith({
        where: { user: { id: userMock.id } },
      });
    });
  });


});
