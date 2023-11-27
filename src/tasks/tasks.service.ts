import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { ILike, Repository } from "typeorm";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}
  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.taskRepo.create({ ...createTaskDto, user });
    return await this.taskRepo.save(task);
  }

  findAll() {
    return this.taskRepo.find({});
  }

  async findOne(id: string) {
    const task = await this.taskRepo.findOneBy({ id });

    if (!task)
      throw new NotFoundException(`Task with id: ${id} could not be found`);
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: User) {
    await this.checkUserTask(id, user.id);
    const task = await this.taskRepo.preload({ id, ...updateTaskDto });

    if (!task) throw new NotFoundException(`Product with id: ${id} not found`);
    await this.taskRepo.save(task);
    return this.findOne(id);
  }

  async remove(id: string, user: User) {
    await this.checkUserTask(id, user.id);
    const task = await this.findOne(id);
    return await this.taskRepo.remove(task);
  }

  async filterTask(searchString: string, user: User): Promise<Task[]> {
    const userId = user.id;
    return this.taskRepo.find({
      where: [
        { description: ILike(`%${searchString}%`), user: { id: userId } },
        { name: ILike(`%${searchString}%`), user: { id: userId } },
      ],
    });
  }

  findAllTasksForUser(user: User) {
    const userId = user.id;
    return this.taskRepo.find({
      where: {
        user: { id: userId },
      },
    });
  }

  private async checkUserTask(id: string, userId: string): Promise<boolean> {
    const taskFromDB = await this.taskRepo.findOne({
      where: {
        id: id,
      },
      relations: {
        user: true,
      },
    });

    if (!taskFromDB) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    if (taskFromDB.user.id !== userId) {
      throw new UnauthorizedException(
        "You are not authorized to update this task"
      );
    }
    return true;
  }
}
