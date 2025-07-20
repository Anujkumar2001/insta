import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post as HttpPost,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from 'src/users/dtos/CreatePost.dto';
import { PostService } from 'src/users/service/post/post.service';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @Get('user/:userId')
  getPostsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.postService.getPostsByUserId(userId);
  }

  @HttpPost('user/:userId')
  createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Put(':id/user/:userId')
  updatePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: Partial<CreatePostDto>,
  ) {
    return this.postService.updatePost(userId, postId, updatePostDto);
  }

  @Delete(':id/user/:userId')
  deletePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(userId, postId);
  }
}
