import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { UsersService } from 'src/users/users.service';
import LoginResponseDto from './dto/login.responce.dto';
import { SignupResponseDto } from './dto/signup.responce.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string): Promise<LoginResponseDto> {
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
      accessToken: this.jwtService.sign(payload),
    };
  }

  async signup(
    email: string,
    password: string,
    name: string,
  ): Promise<SignupResponseDto> {
    try {
      const passwordHash = await bcryptjs.hash(password, 10);
      const user = await this.userService.createUser(email, passwordHash, name);
      return user;
    } catch (err) {
      throw new UnauthorizedException(`${err}`);
    }
  }
}
