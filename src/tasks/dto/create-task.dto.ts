import { Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  description: string;

  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  dueDate?: Date;
}
