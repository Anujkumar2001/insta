import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import PostDto from './dto/post.dto';
import { PostService } from './post.service';
import { RequestWithUser } from './types';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}
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
}
