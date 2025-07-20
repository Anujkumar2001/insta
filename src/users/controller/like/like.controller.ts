import {
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { LikeService } from 'src/users/service/like/like.service';

@Controller('likes')
export class LikeController {
  constructor(private likeService: LikeService) {}

  @HttpPost('post/:postId/user/:userId')
  likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likeService.likePost(userId, postId);
  }

  @Delete('post/:postId/user/:userId')
  unlikePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.likeService.unlikePost(userId, postId);
  }

  @Get('post/:postId')
  getLikesByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.likeService.getPostLikes(postId);
  }
}
