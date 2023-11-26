import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { ILike, Repository } from "typeorm";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>
  ) {}
  async create(createTaskDto: CreateTaskDto) {
    const task = this.taskRepo.create(createTaskDto);
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

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepo.preload({ id, ...updateTaskDto });

    if (!task) throw new NotFoundException(`Product with id: ${id} not found`);
    await this.taskRepo.save(task);
    return this.findOne(id);
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    return await this.taskRepo.remove(task);
  }

  async filterTask(searchString: string): Promise<Task[]> {
    console.log(searchString);
    return this.taskRepo.find({
      where: [
        { description: ILike(`%${searchString}%`) },
        { name: ILike(`%${searchString}%`) },
      ],
    });
  }
}
