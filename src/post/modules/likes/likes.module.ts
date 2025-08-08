import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { PostModule } from 'src/post/post.module';
import { UsersModule } from 'src/users/users.module';
import { Like } from './entities/likes.entity';
import { LikesService } from './likes.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Like]),
    forwardRef(() => PostModule),
    UsersModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  controllers: [],
  providers: [LikesService],
  exports: [LikesService],
})
export class LikesModule {}
