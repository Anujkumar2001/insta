/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import config from 'src/core/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = this.extractTokenFromHeader(request);
      if (!token) {
        throw new UnauthorizedException('invalid token');
      }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.db.auth.JWT_SECRET,
      });
      request['user'] = payload;
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const authorization = request.headers?.authorization;
    if (!authorization) {
      return undefined;
    }
    const [type, token] = authorization.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
