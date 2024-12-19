import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { List, Prisma } from '@prisma/client';
import { CreateListDto, ListType, UpdateListDto } from './list.dtos';

@Injectable()
export class ListService {
  constructor(private prisma: PrismaService) {}

  async createList(data: CreateListDto, userId: string): Promise<List> {
    try {
      const { name, description, workspaceId } = data;

      const list = await this.prisma.list.create({
        data: {
          name,
          description,
          user: {
            connect: {
              id: userId,
            },
          },
          workspace: workspaceId
            ? {
                connect: {
                  id: workspaceId,
                },
              }
            : undefined,
        },
      });

      return list;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
        }
      }

      throw new HttpException(
        'Error creating the list.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateList(data: UpdateListDto, id: string): Promise<List> {
    try {
      const list = await this.prisma.list.update({
        where: {
          id,
        },
        data,
      });

      return list;
    } catch (err) {
      if (err.code === 'P2025') {
        throw new HttpException('List not found.', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        { message: 'Failed to update list.', error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findList(id: string): Promise<ListType> {
    try {
      const list = await this.prisma.list.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          workspaceId: true,
        },
      });

      if (!list) {
        throw new HttpException('List not found.', HttpStatus.NOT_FOUND);
      }

      return list;
    } catch (err) {
      throw new HttpException(
        { message: 'Failed to browse the list.', error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllLists(userId: string): Promise<ListType[]> {
    try {
      const list = await this.prisma.list.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          workspaceId: true,
        },
      });

      if (!list) {
        throw new HttpException('All lists not found.', HttpStatus.NOT_FOUND);
      }

      return list;
    } catch (err) {
      throw new HttpException(
        { message: 'Failed to browse the all list.', error: err.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
