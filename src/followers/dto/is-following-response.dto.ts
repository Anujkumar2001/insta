import { Expose } from 'class-transformer';

export class IsFollowingResponseDto {
  @Expose()
  isFollowing: boolean;
}
