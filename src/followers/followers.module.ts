import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { UsersModule } from '../users/users.module';
import { Follower } from './entity/follower.entity';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follower]),
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),

    forwardRef(() => UsersModule),
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
