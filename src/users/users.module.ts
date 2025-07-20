import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from 'src/typeorm/entities/comment';
import { Like } from 'src/typeorm/entities/like';
import { Post } from 'src/typeorm/entities/post';
import { Profile } from 'src/typeorm/entities/profile';
import { User } from 'src/typeorm/entities/user';
import { LikeController } from './controller/like/like.controller';
import { PostController } from './controller/post/post.controller';
import { UserController } from './controller/user/user.controller';
import { LikeService } from './service/like/like.service';
import { PostService } from './service/post/post.service';
import { UserService } from './service/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post, Comment, Like])],
  controllers: [UserController, PostController, LikeController],
  providers: [UserService, PostService, LikeService],
})
export class UsersModule {}
