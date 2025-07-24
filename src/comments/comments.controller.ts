import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommentDto } from './dto/comment.dto';
import { RequestWithUser } from 'src/post/types';

@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}
  @Post(':postId')
  @UseGuards(AuthGuard)
  createComment(
    @Body() commentDto: CommentDto,
    @Param('postId') postId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this.commentService.createComment(
      userId,
      postId,
      commentDto.content,
    );
  }

  @Get(':postId')
  @UseGuards(AuthGuard)
  getComment(@Param('postId') postId: number, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.commentService.getComments(userId, postId);
  }
}
