import { IsNotEmpty, IsNumber } from 'class-validator';

export class ViewStoryDto {
  @IsNotEmpty()
  @IsNumber()
  storyId: number;
}
