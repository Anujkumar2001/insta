import { IsNumber, IsNotEmpty } from 'class-validator';

export class UnfollowUserDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
