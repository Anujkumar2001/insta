import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CommentResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  comment: string[];

  @Expose()
  @ApiProperty()
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  };

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
