import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  async getProfile(@GetUser() user: User) {
    return this.userService.findUserById(user.id);
  }
}
