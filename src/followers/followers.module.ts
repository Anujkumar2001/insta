import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Follower } from './entity/follower.entity';
import { FollowersController } from './followers.controller';
import { FollowersService } from './followers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Follower]),
    forwardRef(() => UsersModule),
  ],
  controllers: [FollowersController],
  providers: [FollowersService],
  exports: [FollowersService],
})
export class FollowersModule {}
