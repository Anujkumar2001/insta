/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() signInDto: SignInDto): Promise<any> {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Post('signup')
  async signup(@Body() signupDto: SignUpDto): Promise<{ data: any }> {
    const result = await this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
    return {
      data: result,
    };
  }
}
