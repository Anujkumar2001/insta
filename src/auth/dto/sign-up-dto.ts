import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class SignUpDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  @IsString()
  password: string;
}
