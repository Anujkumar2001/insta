// sign-in.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;
}
