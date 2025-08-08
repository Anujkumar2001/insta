import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { UserProfileDto } from 'src/users/dto/user-profile.dto';
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
  user: UserProfileDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
