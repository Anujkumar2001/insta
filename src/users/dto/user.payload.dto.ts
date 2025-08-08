import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, Min } from 'class-validator';

export class UserPayloadDto {
  @ApiProperty({
    description: 'User email address',
    example: 'aman@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Unique user identifier',
    example: 4,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Issued at timestamp (Unix)',
    example: 1754574773,
  })
  @IsInt()
  iat: number;
}
