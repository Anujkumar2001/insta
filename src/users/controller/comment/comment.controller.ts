import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateCommentDto } from 'src/users/dtos/CreateComment.dto';
import { CommentService } from 'src/users/service/comment/comment.service';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpPost('post/:postId/user/:userId')
  createComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(userId, postId, createCommentDto);
  }

  @Get('post/:postId')
  getCommentsByPostId(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.getPostComments(postId);
  }

  @Delete(':id/user/:userId')
  deleteComment(
    @Param('id', ParseIntPipe) commentId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.commentService.deleteComment(userId, commentId);
  }
}
