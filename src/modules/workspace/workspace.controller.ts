import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { CreateWorkspaceDto, UpdateWorkspace } from './workspace.dtos';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  //Get workspace
  @Get(':id')
  async findWorkspace(@Param('id') id: string) {
    return this.workspaceService.findWorkspace(id);
  }

  //Create workspace
  @Post('create')
  async createWorkspace(@Body() data: CreateWorkspaceDto, @Request() req: any) {
    return this.workspaceService.createWorkspace(data, req.user.sub);
  }

  //Edit workspace
  @Put('edit/:id')
  async updateWorkspace(
    @Body() data: UpdateWorkspace,
    @Param('id') id: string,
  ) {
    return this.workspaceService.updateWorkspace(data, id);
  }

  //Add members
  @Put('add-members/:id')
  async addMembers(
    @Body() data: { membersEmail: string[] },
    @Param('id') id: string,
  ) {
    return this.workspaceService.addMembers(data, id);
  }

  //Remove members
  @Put('remove-members/:id')
  async removeMembers(
    @Body() data: { membersEmail: string[] },
    @Param('id') id: string,
  ) {
    return this.workspaceService.removeMembers(data, id);
  }
}
