import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import {
  LikeResponseDto,
  LikesCountResponseDto,
} from './dto/like.response.dto';
import { CreateLikeDto, LikeDto } from './dto/likes.dto';
import { Like } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private readonly postService: PostService,
    private readonly usersService: UsersService,
  ) {}

  async createLike(
    createLikeDto: CreateLikeDto,
    userId: number,
  ): Promise<LikeResponseDto> {
    const { postId } = createLikeDto;

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
      throw new BadRequestException('Post already liked');
    }

    const savedLike = await this.saveNewLike(userId, postId);
    const likeDto = plainToInstance(LikeDto, savedLike, {
      excludeExtraneousValues: true,
    });

    return {
      success: true,
      data: likeDto,
      message: 'Like created successfully',
    };
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
    });

    return this.likesRepository.save(like);
  }

  async getAllLikes(
    postId: number,
    userId?: number,
  ): Promise<LikesCountResponseDto> {
    const postExists = await this.checkPostExists(postId);
    if (!postExists) {
      throw new NotFoundException('Post not found');
    }

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

    return {
      success: true,
      likesCount,
      userHasLiked,
      message: 'Likes retrieved successfully',
    };
  }
}
