import { IsNumber, IsNotEmpty } from 'class-validator';

export class FollowUserDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
