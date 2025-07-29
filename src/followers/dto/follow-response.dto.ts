// src/followers/dto/follow-response.dto.ts

import { Expose } from 'class-transformer';

export class FollowResponseDto {
  @Expose()
  followerId: number;

  @Expose()
  followingId: number;

  @Expose()
  followedAt: Date;
}
