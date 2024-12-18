import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signIn(data: {
    email: string;
    password: string;
  }): Promise<{ access_token: string }> {
    try {
      const user = await this.userService.findUser({ email: data.email });

      const validatePass = await bcrypt.compare(data.password, user.password);

      if (!validatePass) {
        throw new UnauthorizedException('Invalid Credentials');
      }

      const payload = { sub: user.id, email: user.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      throw new HttpException(
        {
          message: 'An error occurred during validation login',
          error: err.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
