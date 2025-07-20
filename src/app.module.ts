import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Profile } from './typeorm/entities/profile';
import { Teacher } from './typeorm/entities/teacher';
import { User } from './typeorm/entities/user';
import { Post } from './typeorm/entities/post';
import { Comment } from './typeorm/entities/comment';
import { Like } from './typeorm/entities/like';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'anuj123',
      database: 'demoapp',
      entities: [User, Teacher, Profile, Post, Comment, Like],
      synchronize: true,
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
