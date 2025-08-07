import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
  location?: { lat: number; lng: number };

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
