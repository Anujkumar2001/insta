import { ApiProperty } from '@nestjs/swagger';

export class StoryViewResponseDto {
  @ApiProperty({ description: 'Story view ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'User ID who viewed the story', example: 1 })
  userId: number;

  @ApiProperty({ description: 'Story ID that was viewed', example: 1 })
  storyId: number;

  @ApiProperty({
    description: 'Timestamp when the story was viewed',
    example: '2023-01-01T00:00:00Z',
  })
  viewedAt: Date;
}
