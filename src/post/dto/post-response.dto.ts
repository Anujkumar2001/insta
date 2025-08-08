import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UserDto } from '../modules/comments/dto/comment.response.dto';
import { LocationDto } from './location.dto';

export class PostResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiPropertyOptional()
  caption?: string;

  @Expose()
  @ApiProperty()
  imgUrl: string;

  @Expose()
  @ApiPropertyOptional()
  location?: LocationDto;

  @Exclude()
  userId: number;

  @Expose()
  @ApiProperty()
  user: UserDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
