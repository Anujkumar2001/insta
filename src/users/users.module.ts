import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/core/config';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [],
})
export class UsersModule {}
