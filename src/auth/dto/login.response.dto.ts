import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

class LoginResponseDto {
  @IsString()
  @ApiProperty({ example: 'access_token' })
  accessToken: string;
}

export default LoginResponseDto;
