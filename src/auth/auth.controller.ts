import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-in.dto';
import LoginResponseDto from './dto/login.response.dto';
import SignUpDto from './dto/sign-up-dto';
import { SignupResponseDto } from './dto/signup.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @ApiOkResponse({ type: SignupResponseDto })
  async signup(@Body() signupDto: SignUpDto): Promise<SignupResponseDto> {
    const result = await this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
    return result;
  }
}
