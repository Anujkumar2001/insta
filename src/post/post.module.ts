import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/core/config';
import { CommentsModule } from 'src/post/modules/comments/comments.module';
import { LikesModule } from 'src/post/modules/likes/likes.module';
import { UsersModule } from 'src/users/users.module';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    AuthModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    UsersModule,
    forwardRef(() => LikesModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
