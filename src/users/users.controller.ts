import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserPayloadDto } from './dto/user.payload.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    description: 'User profile',
    type: UserProfileDto,
  })
  async getProfile(@GetUser() user: UserPayloadDto): Promise<UserProfileDto> {
    return this.userService.findUserById(user.id);
  }
}
