import { IsNumber } from 'class-validator';

export class LikeDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;
}
