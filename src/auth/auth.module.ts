import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import config from 'src/core/config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({ secret: config.db.auth.JWT_SECRET }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
