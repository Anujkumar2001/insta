import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { UsersModule } from 'src/users/users.module';
import { Story } from './entities/story.entity';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  controllers: [StoryController],
  providers: [StoryService],
  imports: [
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
    UsersModule,
    TypeOrmModule.forFeature([Story]),
  ],
})
export class StoryModule {}
