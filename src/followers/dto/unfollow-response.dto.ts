import { Expose } from 'class-transformer';

export class UnfollowResponseDto {
  @Expose()
  unfollowed: boolean;

  @Expose()
  userId: number;

  @Expose()
  targetUserId: number;
}
