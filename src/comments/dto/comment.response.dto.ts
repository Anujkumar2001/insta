import { Expose, Type } from 'class-transformer';
import { CommentDto } from './comment.dto';

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  @Type(() => CommentDto)
  data: CommentDto;

  @Expose()
  comments: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
