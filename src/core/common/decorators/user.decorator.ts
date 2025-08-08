import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IRequestWithUser extends Request {
  user: {
    id: number;
    email: string;
  };
}

export const UserDetails = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<IRequestWithUser>();
    return request.user;
  },
);
