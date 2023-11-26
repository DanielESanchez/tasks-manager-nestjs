import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "./create-task.dto";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  completedDate?: Date;

  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
