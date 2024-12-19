import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Workspace } from '@prisma/client';
import { CreateWorkspaceDto, UpdateWorkspace } from './workspace.dtos';

@Injectable()
export class WorkspaceService {
  constructor(private readonly prisma: PrismaService) {}

  //Create workspace
  async createWorkspace(
    data: CreateWorkspaceDto,
    adminId: string,
  ): Promise<Workspace> {
    try {
      const { membersEmail, ...rest } = data;

      const membersId = await this.findMembersId(membersEmail);
      membersId.push({ id: adminId });

      const workspace = await this.prisma.workspace.create({
        data: {
          ...rest,
          members: {
            connect: membersId.map((member) => ({ id: member.id })),
          },
          admin: {
            connect: {
              id: adminId,
            },
          },
        },
      });

      return workspace;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create workspace!', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Update workspace
  async updateWorkspace(data: UpdateWorkspace, id: string): Promise<Workspace> {
    try {
      const workspace = await this.prisma.workspace.update({
        where: { id },
        data,
      });

      return workspace;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        { message: 'Failed to update workspace!', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Add members
  async addMembers(
    data: { membersEmail: string[] },
    id: string,
  ): Promise<Workspace> {
    try {
      const { membersEmail } = data;

      const membersId = await this.findMembersId(membersEmail);

      const workspace = await this.prisma.workspace.update({
        where: { id },
        data: {
          members: {
            connect: membersId.map((member) => ({ id: member.id })),
          },
        },
        include: {
          members: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return workspace;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        {
          message: 'Failed to add members in workspace!',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Remove members
  async removeMembers(
    data: { membersEmail: string[] },
    id: string,
  ): Promise<Workspace> {
    try {
      const { membersEmail } = data;

      const membersId = await this.findMembersId(membersEmail);

      const workspace = await this.prisma.workspace.update({
        where: { id },
        data: {
          members: {
            disconnect: membersId.map((member) => ({ id: member.id })),
          },
        },
        include: {
          members: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return workspace;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('Workspace not found.', HttpStatus.NOT_FOUND);
      }

      throw new HttpException(
        {
          message: 'Failed to remove members in workspace!',
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Find membersId by email
  async findMembersId(email: string[]): Promise<{ id: string }[]> {
    try {
      const membersId = await this.prisma.user.findMany({
        where: {
          email: {
            in: email,
          },
        },
        select: {
          id: true,
        },
      });

      return membersId;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to find membersId by email!', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Find membersId by email
  async findWorkspace(id: string): Promise<Workspace> {
    try {
      const workspace = await this.prisma.workspace.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          color: true,
          description: true,
          membersId: true,
          adminId: true,
        },
      });

      if (!workspace) {
        throw new HttpException('Workspace not found.', HttpStatus.BAD_REQUEST);
      }

      return workspace;
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to find workspace!', error: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
