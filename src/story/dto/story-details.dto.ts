import { Expose, Type } from 'class-transformer';
import { Story } from '../entities/story.entity';

class StoryViewUser {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;
}

class StoryView {
  @Expose()
  id: number;

  @Expose()
  viewedAt: Date;

  @Expose()
  @Type(() => StoryViewUser)
  user: StoryViewUser;
}

export class StoryDetailsDto extends Story {
  @Expose()
  viewCount: number;

  @Expose()
  @Type(() => StoryView)
  views: StoryView[];
}
