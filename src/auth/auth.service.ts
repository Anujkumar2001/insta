/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findUserWithPassword(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (user?.password !== password) {
      throw new UnauthorizedException();
    }
    const payload = { email: email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, name: string): Promise<any> {
    try {
      const user = await this.userService.createUser(email, password, name);

      // Handle known error response from createUser
      if (user?.statusCode && user.statusCode !== 201) {
        return {
          success: false,
          message: user.message,
          statusCode: user.statusCode,
        };
      }

      return {
        success: true,
        message: 'User created successfully',
        data: user,
        statusCode: 201,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Internal server error');
    }
  }
}
