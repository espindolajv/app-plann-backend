import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './taks.dtos';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async createTask(data: CreateTaskDto, listId: string): Promise<Task> {
    try {
      const task = await this.prisma.task.create({
        data: {
          ...data,
          listId,
        },
      });

      return task;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new HttpException('List not found.', HttpStatus.BAD_REQUEST);
        }
      }

      throw new HttpException(
        { message: 'Failed to create task.', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateTask(data: Prisma.TaskUpdateInput, id: string): Promise<Task> {
    try {
      const taskUpdated = await this.prisma.task.update({
        where: {
          id,
        },
        data,
      });

      return taskUpdated;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Task not found.', HttpStatus.BAD_REQUEST);
        }
      }

      throw new HttpException(
        { message: 'Failed to update task.', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTask(id: string): Promise<Task> {
    try {
      const task = await this.prisma.task.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          checked: true,
          priority: true,
          listId: true,
        },
      });

      if (!task) {
        throw new HttpException('Task not found.', HttpStatus.NOT_FOUND);
      }

      return task;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to find task.', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllTasks(listId: string): Promise<Task[]> {
    try {
      const tasks = await this.prisma.task.findMany({
        where: {
          listId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          checked: true,
          priority: true,
          listId: true,
        },
      });

      if (tasks.length === 0) {
        throw new HttpException(
          'No tasks found for this list.',
          HttpStatus.NOT_FOUND,
        );
      }

      return tasks;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new HttpException('List no found.', HttpStatus.BAD_REQUEST);
        }
      }

      throw new HttpException(
        { message: 'Failed to find all tasks.', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
