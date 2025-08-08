import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiEnvelopeResponse } from 'src/core/common/decorators/api-envelope-response.decorator';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-in.dto';
import LoginResponseDto from './dto/login.response.dto';
import SignUpDto from './dto/sign-up-dto';
import { SignupResponseDto } from './dto/signup.response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiEnvelopeResponse(LoginResponseDto, HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @ApiEnvelopeResponse(SignupResponseDto, HttpStatus.CREATED)
  async signup(@Body() signupDto: SignUpDto): Promise<SignupResponseDto> {
    const result = await this.authService.signup(
      signupDto.email,
      signupDto.password,
      signupDto.name,
    );
    return result;
  }
}
