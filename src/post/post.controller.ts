import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import PostDto from './dto/post.dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('post')
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}
  @Post('upload')
  async UploadPost(@Body() postDto: PostDto, @Req() req) {
    const userId = req.body.userId;
    return this.postService.createPost(
      postDto.caption,
      postDto.imgUrl,
      postDto.location,
      userId,
    );
  }
}
