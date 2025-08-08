import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiEnvelopeResponse } from 'src/core/common/decorators/api-envelope-response.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserProfileDto } from './dto/user-profile.dto';
import { UserPayloadDto } from './dto/user.payload.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiEnvelopeResponse(UserProfileDto)
  async getProfile(@GetUser() user: UserPayloadDto): Promise<UserProfileDto> {
    return this.userService.findUserById(user.id);
  }
}
