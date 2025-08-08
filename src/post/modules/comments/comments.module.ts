import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import config from 'src/core/config';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    AuthModule,
    forwardRef(() => PostModule),
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    UsersModule,
  ],
  controllers: [],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
