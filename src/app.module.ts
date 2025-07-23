import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import config from './core/config';
import { Post } from './post/entities/post';
import { PostModule } from './post/post.module';
import { User } from './users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

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
      entities: [User, Post],
      synchronize: true,
    }),
    AuthModule,
    PostModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
