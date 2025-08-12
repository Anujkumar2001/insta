import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
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
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(LoginResponseDto, HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
  ): Promise<LoginResponseDto> {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
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
