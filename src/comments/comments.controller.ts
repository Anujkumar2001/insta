import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RequestWithUser } from 'src/post/types';
import { CommentsService } from './comments.service';
import { CommentDto } from './dto/comment.dto';

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
  getComment(@Param('postId') postId: number) {
    return this.commentService.getComments(postId);
  }
}
