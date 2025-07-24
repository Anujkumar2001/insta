import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from 'src/comments/comments.service';
import { CommentDto } from 'src/comments/dto/comment.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikesService } from 'src/likes/likes.service';
import PostDto from './dto/post.dto';
import { PostService } from './post.service';
import { RequestWithUser } from './types';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}
  @Post('upload')
  async UploadPost(@Body() postDto: PostDto, @Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.postService.createPost(
      postDto.caption,
      postDto.imgUrl,
      postDto.location,
      userId,
    );
  }
  @Get()
  async getAllPosts(@Req() req: RequestWithUser) {
    const userId = req.user.sub;
    return this.postService.getAllPost(userId);
  }
  @Post('like/:postId')
  async createLike(
    @Param('postId') postId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this.likesService.createLike(postId, userId);
  }
  @Get('like/:postId')
  async getAllLikes(
    @Param('postId') postId: number,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user.sub;
    return this.likesService.getAllLikes(postId, userId);
  }

  @Post('comment/:postId')
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

  @Get('comment/:postId')
  getComment(@Param('postId') postId: number) {
    return this.commentService.getComments(postId);
  }
}
