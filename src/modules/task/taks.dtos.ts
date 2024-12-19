import { IsString, IsOptional, IsEnum, IsNotEmpty } from 'class-validator';
import { Priority } from '@prisma/client';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsString()
  @IsOptional()
  description?: string;
}
