/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
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
    private readonly postService: PostService,
    private readonly usersService: UsersService,
  ) {}

  async createLike(postId: number, userId: number): Promise<any> {
    const userExists = await this.checkUserExists(userId);
    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    const postExists = await this.checkPostExists(postId);
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

    const existingLike = await this.findExistingLike(userId, postId);
    if (existingLike) {
      throw new NotFoundException('Post already liked');
    }
    const savedLike = await this.saveNewLike(userId, postId);
    return { message: 'Post liked successfully', data: savedLike };
  }

  private async checkUserExists(userId: number): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    return !!user;
  }

  private async checkPostExists(postId: number): Promise<boolean> {
    const post = await this.postService.getPostById(postId);
    return !!post;
  }

  private async findExistingLike(userId: number, postId: number): Promise<any> {
    return this.likesRepository.findOne({
      where: {
        postId,
        userId,
      },
    });
  }

  private async saveNewLike(userId: number, postId: number): Promise<any> {
    const like = this.likesRepository.create({
      post: { id: postId },
      user: { id: userId },
      postId,
      userId,
    });

    return this.likesRepository.save(like);
  }

  async getAllLikes(postId: number, userId?: number): Promise<any> {
    const likesCount = await this.likesRepository.count({
      where: {
        postId,
      },
    });

    let userHasLiked: boolean | undefined;
    if (userId) {
      const userLike = await this.findExistingLike(userId, postId);
      userHasLiked = !!userLike;
    }

    return { likesCount, userHasLiked };
  }
}
