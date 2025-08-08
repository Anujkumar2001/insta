import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CommentsService } from 'src/comments/comments.service';
import { CommentDto } from 'src/comments/dto/comment.dto';
import { CommentResponseDto } from 'src/comments/dto/comment.response.dto';
import { UserDetails } from 'src/core/common/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikesCountResponseDto } from 'src/likes/dto/like.response.dto';
import { LikesService } from 'src/likes/likes.service';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { PostService } from './post.service';

@ApiTags('posts')
@ApiBearerAuth()
@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}
  @Post()
  @HttpCode(201)
  @ApiOkResponse({ type: PostResponseDto })
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @UserDetails() user: User,
  ): Promise<PostResponseDto> {
    const userId = user.id;
    const post = await this.postService.createPost({
      ...createPostDto,
      userId,
    });
    return post;
  }

  @Get()
  @ApiOkResponse({ type: PostResponseDto })
  async getAllPosts(
    @UserDetails() user: User,
    @Query() pagination: PostsPaginationDto,
  ): Promise<PostResponseDto[]> {
    const userId = user.id;
    const posts = await this.postService.getAllPosts(userId, pagination);
    return posts;
  }

  @Get(':postId')
  @ApiOkResponse({ type: PostResponseDto })
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostResponseDto> {
    return this.postService.getPostById(postId);
  }

  @Post(':postId/likes')
  @ApiOkResponse({ description: 'Like created successfully' })
  @HttpCode(201)
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<{ success: boolean }> {
    const userId = user.id;
    await this.likesService.createLike({ postId }, userId);
    return { success: true };
  }

  @Get(':postId/likes')
  @ApiOkResponse({ type: LikesCountResponseDto })
  async getPostLikes(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<LikesCountResponseDto> {
    const userId = user.id;
    return this.likesService.getAllLikes(postId, userId);
  }

  @Post(':postId/comments')
  @ApiOkResponse({ type: CommentResponseDto })
  @HttpCode(201)
  async createComment(
    @Body() commentDto: CommentDto,
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<CommentResponseDto> {
    const userId = user.id;
    return this.commentService.createComment(
      userId,
      postId,
      commentDto.comment,
    );
  }

  @Get(':postId/comments')
  @ApiOkResponse({ type: [CommentResponseDto] })
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getComments(postId);
  }
}
