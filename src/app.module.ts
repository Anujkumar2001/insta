import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { Comment } from './comments/entities/comment.entity';
import config from './core/config';
import { FollowsModule } from './follows/follows.module';
import { Like } from './likes/entities/likes.entity';
import { LikesModule } from './likes/likes.module';
import { Post } from './post/entities/post.entity';
import { PostModule } from './post/post.module';
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
      entities: [User, Post, Like, Comment],
      synchronize: true,
    }),
    AuthModule,
    PostModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    LikesModule,
    CommentsModule,
    FollowsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
