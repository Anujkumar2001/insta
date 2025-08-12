import { ApiProperty } from '@nestjs/swagger';

export class StoryResponseDto {
  @ApiProperty({ description: 'Story ID', example: 1 })
  id: number;

  @ApiProperty({
    description: 'Story caption',
    example: 'Beautiful sunset',
    nullable: true,
  })
  caption: string;

  @ApiProperty({
    description: 'URL to the media',
    example: 'https://example.com/media/image.jpg',
  })
  mediaUrl: string;

  @ApiProperty({
    description: 'Type of media',
    enum: ['image', 'video'],
    example: 'image',
  })
  mediaType: 'image' | 'video';

  @ApiProperty({ description: 'Whether the story is archived', example: false })
  isArchived: boolean;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'Expiration timestamp',
    example: '2023-01-02T00:00:00Z',
    nullable: true,
  })
  expiresAt: Date;

  @ApiProperty({ description: 'User ID who created the story', example: 1 })
  userId: number;
}
