import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { Follower } from 'src/followers/entity/follower.entity';
import { FollowersModule } from 'src/followers/followers.module';
import { UsersModule } from 'src/users/users.module';
import { StoryView } from './entities/story-view.entity';
import { Story } from './entities/story.entity';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  controllers: [StoryController],
  providers: [StoryService],
  imports: [
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    UsersModule,
    FollowersModule,
    TypeOrmModule.forFeature([Story, StoryView, Follower]),
  ],
})
export class StoryModule {}
