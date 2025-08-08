import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocationDto } from './location.dto';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  @ApiProperty()
  caption: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  imgUrl: string;

  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  @ApiProperty({ type: LocationDto })
  location: LocationDto;
}
