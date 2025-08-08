import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiEnvelopeResponse } from 'src/core/common/decorators/api-envelope-response.decorator';
import { UserDetails } from 'src/core/common/decorators/user.decorator';
import { ApiResponseDto } from 'src/core/common/dto/api.response.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CommentsService } from 'src/post/modules/comments/comments.service';
import { CommentDto } from 'src/post/modules/comments/dto/comment.dto';
import { CommentResponseDto } from 'src/post/modules/comments/dto/comment.response.dto';
import { LikesCountResponseDto } from 'src/post/modules/likes/dto/like.response.dto';
import { LikesService } from 'src/post/modules/likes/likes.service';
import { User } from 'src/users/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { PostService } from './post.service';

@ApiTags('posts')
@ApiBearerAuth()
@ApiExtraModels(ApiResponseDto, PostResponseDto)
@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly likesService: LikesService,
    private readonly commentService: CommentsService,
  ) {}

  // Create a new post
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiEnvelopeResponse(PostResponseDto, HttpStatus.CREATED)
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

  // Get all posts
  @Get()
  @ApiEnvelopeResponse(PostResponseDto)
  async getAllPosts(
    @UserDetails() user: User,
    @Query() pagination: PostsPaginationDto,
  ): Promise<PostResponseDto[]> {
    const userId = user.id;
    return this.postService.getAllPosts(userId, pagination);
  }

  // Get a post by ID
  @Get(':postId')
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiEnvelopeResponse(PostResponseDto)
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostResponseDto> {
    return this.postService.getPostById(postId);
  }

  // Like a post
  @Post(':postId/likes')
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiCreatedResponse({ description: 'Like created successfully' })
  @HttpCode(HttpStatus.CREATED)
  async likePost(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<{ success: boolean }> {
    const userId = user.id;
    await this.likesService.createLike({ postId }, userId);
    return { success: true };
  }

  // Get likes count for a post
  @Get(':postId/likes')
  @ApiEnvelopeResponse(LikesCountResponseDto)
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  async getPostLikes(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<LikesCountResponseDto> {
    const userId = user.id;
    return this.likesService.getAllLikes(postId, userId);
  }

  // Add a comment to a post
  @Post(':postId/comments')
  @ApiEnvelopeResponse(CommentResponseDto, HttpStatus.CREATED)
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @HttpCode(HttpStatus.CREATED)
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

  // Get all comments for a post
  @Get(':postId/comments')
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiEnvelopeResponse(CommentResponseDto)
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getComments(postId);
  }
}
