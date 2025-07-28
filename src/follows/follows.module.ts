import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Follows from './entities/follows.entity';
import { FollowsService } from './follows.service';

@Module({
  controllers: [],
  providers: [FollowsService],
  exports: [FollowsService],
  imports: [TypeOrmModule.forFeature([Follows])],
})
export class FollowsModule {}
