import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequestWithUser } from 'src/post/types';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.findUserById(req.user.id);
  }
}
