import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateStoryDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsNotEmpty()
  @IsUrl()
  mediaUrl: string;

  @IsOptional()
  @IsEnum(['image', 'video'])
  mediaType?: 'image' | 'video';

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiresAt?: Date;
}
