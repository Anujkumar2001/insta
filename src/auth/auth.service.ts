/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
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
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const payload = { email: email, id: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(email: string, password: string, name: string): Promise<any> {
    try {
      const passwordHash = await bcryptjs.hash(password, 10);
      const user = await this.userService.createUser(email, passwordHash, name);
      if (user?.statusCode && user.statusCode !== 201) {
        return user;
      }
      return {
        data: user,
      };
    } catch (err) {
      throw new UnauthorizedException(`${err}`);
    }
  }
}
