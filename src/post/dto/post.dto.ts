import { IsString } from 'class-validator';

export default class PostDto {
  @IsString()
  imgUrl: string;

  @IsString()
  caption: string;

  @IsString()
  location: { lat: number; lng: number };
}
