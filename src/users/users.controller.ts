import { Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FollowsService } from 'src/follows/follows.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly followService: FollowsService) {}

  @Post('/:followerId/follow')
  async createFollow(
    @Param('followerId') followerId: number,
    @Param('followingId') followingId: number,
    @Req() req: any,
  ) {
    console.log(req.user.sub, 'iddd');
    return this.followService.createFollow(followerId, followingId);
  }
}
