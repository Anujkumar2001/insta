import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreateLikeResponseDto, GetLikesResponseDto } from './dto/response.dto';
import { Like } from './entities/likes.entity';
import { ILikesService } from './interfaces/likes.interface';

@Injectable()
export class LikesService implements ILikesService {
  private readonly logger = new Logger(LikesService.name);

  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly postService: PostService,
    private readonly usersService: UsersService,
  ) {}

  async createLike(
    postId: number,
    userId: number,
  ): Promise<CreateLikeResponseDto> {
    try {
      // Check if the user exists
      const userExists = await this.checkUserExists(userId);
      if (!userExists) {
        return CreateLikeResponseDto.userNotFound(userId);
      }

      // Check if the post exists
      const postExists = await this.checkPostExists(postId);
      if (!postExists) {
        return CreateLikeResponseDto.postNotFound(postId);
      }

      const existingLike = await this.findExistingLike(userId, postId);
      if (existingLike) {
        return CreateLikeResponseDto.alreadyLiked();
      }
      const savedLike = await this.saveNewLike(userId, postId);
      return CreateLikeResponseDto.fromEntity(savedLike);
    } catch (error) {
      this.logger.error(
        `Failed to create like: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  private async checkUserExists(userId: number): Promise<boolean> {
    const user = await this.usersService.findUserById(userId);
    return !!user;
  }

  private async checkPostExists(postId: number): Promise<boolean> {
    const post = await this.postService.getPostById(postId);
    return !!post;
  }

  private async findExistingLike(
    userId: number,
    postId: number,
  ): Promise<Like | null> {
    return this.likesRepository.findOne({
      where: {
        postId,
        userId,
      },
    });
  }

  private async saveNewLike(userId: number, postId: number): Promise<Like> {
    const like = this.likesRepository.create({
      post: { id: postId },
      user: { id: userId },
      postId,
      userId,
    });

    return this.likesRepository.save(like);
  }

  async getAllLikes(
    postId: number,
    userId?: number,
  ): Promise<GetLikesResponseDto> {
    try {
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

      return GetLikesResponseDto.fromCount(likesCount, userHasLiked);
    } catch (error) {
      this.logger.error(
        `Failed to get likes: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
