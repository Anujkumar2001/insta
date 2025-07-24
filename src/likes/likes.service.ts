/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Like } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private postService: PostService,
    private usersService: UsersService,
  ) {}
  async createLike(postId: number, userId: number) {
    try {
      // First, check if the user exists
      const user = await this.usersService.findUserById(userId);
      if (!user) {
        return {
          message: `User with ID ${userId} does not exist`,
        };
      }

      // Then check if the post exists
      const post = await this.postService.getPostById(postId);
      if (!post) {
        return {
          message: `Post with ID ${postId} does not exist`,
        };
      }

      // Check if the like already exists
      let like = await this.likesRepository.findOne({
        where: {
          postId,
          userId,
        },
      });

      if (like) {
        return {
          message: 'Post already liked by this user',
        };
      }

      // Create new like
      like = this.likesRepository.create({
        post: { id: postId },
        user: { id: userId },
        postId,
        userId,
      });

      const savedLike = await this.likesRepository.save(like);
      return {
        message: 'Like created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create like',
        error: error.message,
        statusCode: 500,
      };
    }
  }

  async allLikes(postId: number, userId: number) {
    const likesCount = await this.likesRepository.count({
      where: {
        postId,
      },
    });
    return { totalLikes: likesCount };
  }
}
