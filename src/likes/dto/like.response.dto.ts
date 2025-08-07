import { Expose, Type } from 'class-transformer';
import { LikeDto } from './likes.dto';

export class LikeResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  @Type(() => LikeDto)
  data: LikeDto;

  @Expose()
  message: string;
}

export class LikesCountResponseDto {
  @Expose()
  success: boolean;

  @Expose()
  likesCount: number;

  @Expose()
  userHasLiked?: boolean;

  @Expose()
  message: string;
}
