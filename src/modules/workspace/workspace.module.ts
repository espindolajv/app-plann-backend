import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../database/prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [WorkspaceController],
  providers: [WorkspaceService, PrismaService],
})
export class WorkspaceModule {}
