import { Body, Controller, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDto } from './user.dtos';
import { AuthGuard } from '../auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Put('update')
  async updateUser(
    @Body()
    updateUserData: {
      where: { email: string };
      password: string;
      data: UpdateUserDto;
    },
  ): Promise<{ message: string; user: User }> {
    return this.userService.updateUser(updateUserData);
  }
}
