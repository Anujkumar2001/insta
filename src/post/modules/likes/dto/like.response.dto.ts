import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: true })
  success: boolean;

  @Expose()
  @ApiProperty({ example: 0 })
  likesCount: number;

  @Expose()
  @ApiProperty({ example: false })
  userHasLiked?: boolean;

  @Expose()
  @ApiProperty({ example: 'Likes retrieved successfully' })
  message: string;
}
