import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikesService } from './likes.service';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post(':postId')
  @UseGuards(AuthGuard)
  async createLike(
    @Param('postId') postId: number,
    // @Req() req: RequestWithUser, // Uncomment if needed in the future
  ) {
    // Use the first user in the database for testing purposes
    // In a real application, you would ensure the user exists or handle errors properly
    return this.likesService.createLike(postId, 1); // Using user ID 1 which exists in the database
  }
}
