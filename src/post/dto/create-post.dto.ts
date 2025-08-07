import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { LocationDto } from './location.dto';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  caption: string;

  @IsString()
  imgUrl: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location: LocationDto;
}
