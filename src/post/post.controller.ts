import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommentsService } from 'src/comments/comments.service';
import { CommentDto } from 'src/comments/dto/comment.dto';
import { UserDetails } from 'src/core/common/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikesService } from 'src/likes/likes.service';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { PostService } from './post.service';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}
  @Post('upload')
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UserDetails() user: User,
  ) {
    const userId = user.id;
    const post = await this.postService.createPost({
      ...createPostDto,
      userId,
    });
    return post;
  }

  @Get()
  async getAllPosts(
    @UserDetails() user: User,
    @Query() pagination: PostsPaginationDto,
  ) {
    const userId = user.id;
    const posts = await this.postService.getAllPosts(userId, pagination);
    return posts;
  }

  @Post(':postId/like')
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ) {
    const userId = user.id;
    await this.likesService.createLike(postId, userId);
  }

  @Get(':postId/likes')
  async getPostLikes(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<any> {
    const userId = user.id;
    return this.likesService.getAllLikes(postId, userId);
  }

  @Post(':postId/comment')
  createComment(
    @Body() commentDto: CommentDto,
    @Param('postId') postId: number,
    @UserDetails() user: User,
  ) {
    const userId = user.id;
    return this.commentService.createComment(
      userId,
      postId,
      commentDto.content,
    );
  }

  @Get(':postId/comments')
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<any> {
    return this.commentService.getComments(postId);
  }
}
