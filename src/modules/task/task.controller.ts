import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './taks.dtos';
import { AuthGuard } from '../auth/auth.guard';
import { Prisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //Create task by list id
  @Post(':id')
  async createTask(@Param('id') id: string, @Body() data: CreateTaskDto) {
    return this.taskService.createTask(data, id);
  }

  //Update task by task id
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() data: Prisma.TaskUpdateInput,
  ) {
    return this.taskService.updateTask(data, id);
  }

  //Find task by task id
  @Get(':id')
  async findTask(@Param('id') id: string) {
    return this.taskService.findTask(id);
  }

  //Find all tasks by list id
  @Get('list/:id')
  async findAllTasks(@Param('id') id: string) {
    return this.taskService.findAllTasks(id);
  }
}
