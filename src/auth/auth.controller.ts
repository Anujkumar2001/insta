import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import LoginResponseDto from './dto/login.responce.dto';
import { SignInDto } from './dto/sign-in.dto';
import SignUpDto from './dto/sign-up-dto';
import { SignupResponseDto } from './dto/signup.responce.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() signInDto: SignInDto): Promise<LoginResponseDto> {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @Post('signup')
  @ApiOkResponse({ type: SignupResponseDto })
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
