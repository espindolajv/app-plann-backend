import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from './modules/auth/auth.guard';

@Controller()
export class AppController {
  constructor() {}

  @UseGuards(AuthGuard)
  @Get('home')
  async home(@Request() req: any) {
    return req.user;
  }
}
