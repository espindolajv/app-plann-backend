import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { AuthService } from './modules/auth/auth.service';
import { AuthGuard } from './modules/auth/auth.guard';
import { UserService } from './modules/user/user.service';
import { CreateUserDto } from './modules/user/user.dtos';

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async signUp(@Body() userData: CreateUserDto): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInData: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(signInData);
  }

  @UseGuards(AuthGuard)
  @Get('home')
  async home(@Request() req: any) {
    return req.user;
  }
}
