import { Expose, Type } from 'class-transformer';

export class CommentUserDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

export class CommentResponseDto {
  @Expose()
  id: number;

  @Expose()
  comments: string[];

  @Expose()
  @Type(() => CommentUserDto)
  user: CommentUserDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<CommentResponseDto>) {
    Object.assign(this, partial);
  }
}
