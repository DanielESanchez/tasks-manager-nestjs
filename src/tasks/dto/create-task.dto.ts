import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    description: 'Name/Title of the task',
    minimum: 2,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Description of the task',
    minimum: 2,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  description: string;

  @ApiProperty({
    description: 'String date when the task started',
    minimum: 2,
    required: false,
    default: "Date when the task is saved"
  })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty({
    description: 'String date when the task should be completed',
    minimum: 2,
    required: false,
    default: null
  })
  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
