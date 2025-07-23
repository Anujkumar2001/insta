import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { PostModule } from 'src/post/post.module';
import { Like } from './entities/likes.entity';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    PostModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
