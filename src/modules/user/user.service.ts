import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/modules/database/prisma.service';
import { UpdateUserDto, UserValidateDto } from './user.dtos';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const hashPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashPassword,
      },
    });
  }

  async updateUser(updateUserData: {
    where: Prisma.UserWhereUniqueInput;
    data: UpdateUserDto;
    password: string;
  }): Promise<{ message: string; user: User }> {
    try {
      const { where, data, password } = updateUserData;

      const user = await this.findUser(where);

      if (!(await bcrypt.compare(password, user.password))) {
        throw new HttpException(
          'The provided password is incorrect. Please check and try again.',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      }

      const userUpdated = await this.prisma.user.update({ where, data });

      return { message: 'User updated successfully!', user: userUpdated };
    } catch (err) {
      throw new HttpException(
        { message: 'An error occurred while updating the user', error: err },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findUser(where: Prisma.UserWhereUniqueInput): Promise<UserValidateDto> {
    try {
      const user = await this.prisma.user.findUnique({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
        },
      });

      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } catch (err) {
      throw new HttpException(
        { message: 'An error occurred during login', error: err },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
