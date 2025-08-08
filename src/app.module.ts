import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import config from './core/config';
import { Follower } from './followers/entity/follower.entity';
import { FollowersModule } from './followers/followers.module';
import { Post } from './post/entities/post.entity';
import { CommentsModule } from './post/modules/comments/comments.module';
import { Comment } from './post/modules/comments/entities/comment.entity';
import { Like } from './post/modules/likes/entities/likes.entity';
import { LikesModule } from './post/modules/likes/likes.module';
import { PostModule } from './post/post.module';
import { StoryView } from './story/entities/story-view.entity';
import { Story } from './story/entities/story.entity';
import { StoryModule } from './story/story.module';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      type: config.db.auth.DB_TYPE as any,
      host: config.db.auth.DB_HOST,
      port: Number(config.db.auth.DB_PORT),
      username: config.db.auth.DB_USER_NAME,
      password: config.db.auth.DB_PASSWORD,
      database: config.db.auth.DB_NAME,
      entities: [User, Post, Like, Comment, Follower, Story, StoryView],
      synchronize: true,
    }),
    AuthModule,
    PostModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    LikesModule,
    CommentsModule,
    FollowersModule,
    UsersModule,
    StoryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
