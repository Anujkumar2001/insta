import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserProfileDto } from 'src/users/dto/user-profile.dto';

export class CommentResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  comment: string;

  @Expose()
  @ApiProperty({ type: UserProfileDto })
  @Type(() => UserProfileDto)
  user: UserProfileDto;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  updatedAt: Date;
}
