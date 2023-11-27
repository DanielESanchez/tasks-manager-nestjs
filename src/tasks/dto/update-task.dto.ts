
import { CreateTaskDto } from "./create-task.dto";
import { IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, PartialType } from "@nestjs/swagger";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @ApiProperty({
    description: 'String date when the task starts',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'String date when the task was completed',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  completedDate?: Date;

  @ApiProperty({
    description: 'String date when the task should be completed',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
