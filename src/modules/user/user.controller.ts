import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { CreateUserDto, UpdateUserDto } from './user.dtos';
import { AuthGuard } from '../auth/auth.guard';
import { AuthService } from '../auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  //Create user
  @Post('signup')
  async signUp(@Body() userData: CreateUserDto): Promise<User> {
    return this.userService.createUser(userData);
  }

  //Login user
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signIn(
    @Body() signInData: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    return this.authService.signIn(signInData);
  }

  @UseGuards(AuthGuard)
  @Put('update')
  async updateUser(
    @Body()
    updateUserData: {
      where: { email: string };
      password: string;
      data: UpdateUserDto;
    },
  ): Promise<User> {
    return this.userService.updateUser(updateUserData);
  }
}
