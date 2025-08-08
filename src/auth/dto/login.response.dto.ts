import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class LoginResponseDto {
  @Expose()
  @ApiProperty()
  accessToken: string;
}

export default LoginResponseDto;
