import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
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

  @Expose()
  @ApiProperty()
  userId: number;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
