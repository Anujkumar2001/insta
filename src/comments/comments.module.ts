import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/core/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    AuthModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
