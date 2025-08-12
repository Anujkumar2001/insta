/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import LoginResponseDto from './dto/login.response.dto';
import { SignupResponseDto } from './dto/signup.response.dto';

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
    return plainToInstance(LoginResponseDto, {
      accessToken: this.jwtService.sign(payload),
    });
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
      if (err.message.includes('already exists')) {
        throw new ConflictException(`User with this email already exists`);
      }
      throw new InternalServerErrorException(
        `Failed to create user: ${err.message}`,
      );
    }
  }
}
