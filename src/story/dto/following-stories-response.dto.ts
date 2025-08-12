import { ApiProperty } from '@nestjs/swagger';
import { StoryResponseDto } from './story-response.dto';

export class FollowingStoriesResponseDto {
  @ApiProperty({ description: 'Story data', type: StoryResponseDto })
  story: StoryResponseDto;

  @ApiProperty({
    description: 'Whether the story has been viewed by the current user',
    example: true,
  })
  viewed: boolean;
}
