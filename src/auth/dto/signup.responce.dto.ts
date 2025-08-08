// src/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: 5, description: 'Unique user ID' })
  id: number;

  @ApiProperty({ example: 'aman', description: 'Full name of the user' })
  name: string;

  @ApiProperty({ example: 'aman1@gmdail.com', description: 'Email address' })
  email: string;
}
