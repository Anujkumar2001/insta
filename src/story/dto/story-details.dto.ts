import { Story } from '../entities/story.entity';

export interface StoryDetailsDto extends Story {
  viewCount: number;
  views: {
    id: number;
    viewedAt: Date;
    user: {
      id: number;
      name: string;
      email: string;
    };
  }[];
}
