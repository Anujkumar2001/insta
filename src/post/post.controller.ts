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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserDetails } from 'src/core/common/user.decorator';
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
  @ApiOperation({ summary: 'Create a new post' })
  @ApiCreatedResponse({ type: PostResponseDto })
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
  @ApiOkResponse({ type: [PostResponseDto] })
  async getAllPosts(
    @UserDetails() user: User,
    @Query() pagination: PostsPaginationDto,
  ): Promise<PostResponseDto[]> {
    const userId = user.id;
    return this.postService.getAllPosts(userId, pagination);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiOkResponse({ type: PostResponseDto })
  async getPostById(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<PostResponseDto> {
    return this.postService.getPostById(postId);
  }

  @Post(':postId/likes')
  @ApiOperation({ summary: 'Like a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiCreatedResponse({
    description: 'Like created successfully',
    type: Object,
  })
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
  @ApiOperation({ summary: 'Get likes count for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiOkResponse({ type: LikesCountResponseDto })
  async getPostLikes(
    @Param('postId', ParseIntPipe) postId: number,
    @UserDetails() user: User,
  ): Promise<LikesCountResponseDto> {
    const userId = user.id;
    return this.likesService.getAllLikes(postId, userId);
  }

  @Post(':postId/comments')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiCreatedResponse({ type: CommentResponseDto })
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
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID', type: 'number' })
  @ApiOkResponse({ type: [CommentResponseDto] })
  async getComments(
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<CommentResponseDto[]> {
    return this.commentService.getComments(postId);
  }
}
