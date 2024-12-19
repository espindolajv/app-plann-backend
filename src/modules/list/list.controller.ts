import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Put,
} from '@nestjs/common';
import { ListService } from './list.service';
import { CreateListDto, UpdateListDto } from './list.dtos';
import { AuthGuard } from '../auth/auth.guard';

@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  async createList(@Body() data: CreateListDto, @Request() req: any) {
    return this.listService.createList(data, req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get('all')
  async findLists(@Request() req: any) {
    return this.listService.findAllLists(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findList(@Param('id') id: string) {
    return this.listService.findList(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async updateList(@Param('id') id: string, @Body() data: UpdateListDto) {
    return this.listService.updateList(data, id);
  }
}
