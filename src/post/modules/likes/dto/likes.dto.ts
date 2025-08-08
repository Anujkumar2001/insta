import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateLikeDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  postId: number;
}

export class LikeDto {
  @Expose()
  id: number;

  @Expose()
  postId: number;

  @Expose()
  userId: number;

  @Expose()
  createdAt: Date;
}
