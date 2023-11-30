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
    private readonly taskRepository: Repository<Task>
  ) {}
  async create(createTaskDto: CreateTaskDto, user: User) {
    const task = this.taskRepository.create({ ...createTaskDto, user });
    return await this.taskRepository.save(task);
  }

  /**
   *
   * @returns promise array of all tasks saved
   */
  findAll(): Promise<Task[]> {
    return this.taskRepository.find({});
  }

  /**
   *
   * @param id uuid of the task to search
   * @returns promise task for the id receive
   */
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task)
      throw new NotFoundException(`Task with id: ${id} could not be found`);
    return task;
  }

  /**
   *
   * @param id uuid of the task to update
   * @param updateTaskDto update data
   * @param user user trying to update the task
   * @returns promise task updated
   */
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User
  ): Promise<Task> {
    await this.checkUserTask(id, user.id);
    const task = await this.taskRepository.preload({ id, ...updateTaskDto });

    if (!task) throw new NotFoundException(`Product with id: ${id} not found`);
    await this.taskRepository.save(task);
    return this.findOne(id);
  }

  /**
   *
   * @param id uuid of the task to remove
   * @param user user trying to remove the task
   * @returns promise task removed
   */
  async remove(id: string, user: User): Promise<Task> {
    await this.checkUserTask(id, user.id);
    const task = await this.findOne(id);
    return await this.taskRepository.remove(task);
  }

  /**
   *
   * @param searchString search term to filter the name of task
   * @param user user making the request
   * @returns promise array of all tasks that include the search term in their name
   */
  async filterTask(searchString: string, user: User): Promise<Task[]> {
    const userId = user.id;
    return this.taskRepository.find({
      where: [
        { description: ILike(`%${searchString}%`), user: { id: userId } },
        { name: ILike(`%${searchString}%`), user: { id: userId } },
      ],
    });
  }

  /**
   *
   * @param user user making the request
   * @returns promise array of all tasks for user
   */
  findAllTasksForUser(user: User): Promise<Task[]> {
    const userId = user.id;
    return this.taskRepository.find({
      where: {
        user: { id: userId },
      },
    });
  }

  /**
   *
   * @param idTask uuid of the task to check author
   * @param userId uuid of user making the request
   * @returns promise true if userId is the same than the userId in the saved task
   */
  private async checkUserTask(idTask: string, userId: string): Promise<true> {
    const taskFromDB = await this.taskRepository.findOne({
      where: {
        id: idTask,
      },
      relations: {
        user: true,
      },
    });

    if (!taskFromDB) {
      throw new NotFoundException(`Task with id: ${idTask} not found`);
    }

    if (taskFromDB.user.id !== userId) {
      throw new UnauthorizedException(
        "You are not authorized to update this task"
      );
    }
    return true;
  }
}
