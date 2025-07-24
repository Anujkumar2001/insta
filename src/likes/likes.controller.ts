import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequestWithUser } from 'src/post/types';
import { CreateLikeResponseDto, GetLikesResponseDto } from './dto/response.dto';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  async createLike(
    @Param('postId') postId: number,
    @Req() req: RequestWithUser,
  ): Promise<CreateLikeResponseDto> {
    const userId = req.user.sub;
    return this.likesService.createLike(postId, userId);
  }

  @Get(':postId')
  @UseGuards(AuthGuard)
  async getAllLikes(
    @Param('postId') postId: number,
    @Req() req: RequestWithUser,
  ): Promise<GetLikesResponseDto> {
    const userId = req.user.sub;
    return this.likesService.getAllLikes(postId, userId);
  }
}
