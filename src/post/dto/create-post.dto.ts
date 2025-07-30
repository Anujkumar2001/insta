import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsOptional()
  caption: string;

  @IsString()
  imgUrl: string;

  @IsString()
  @IsOptional()
  location: string;
}
