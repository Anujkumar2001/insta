import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  content: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
