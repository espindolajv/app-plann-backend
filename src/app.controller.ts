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
import { UserService } from './user/user.service';
import { CreateUserDto } from './user/user.dtos';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';

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
