// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class SignupResponseDto {
  @Expose()
  @ApiProperty({ example: 5, description: 'Unique user ID' })
  id: number;

  @Expose()
  @ApiProperty({ example: 'aman', description: 'Full name of the user' })
  name: string;

  @Expose()
  @ApiProperty({ example: 'aman1@gmdail.com', description: 'Email address' })
  email: string;

  @Exclude()
  @ApiProperty({ example: 'aman1@gmdail.com', description: 'Email address' })
  password: string;
}
