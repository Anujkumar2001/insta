import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto & { userId: number },
  ): Promise<PostResponseDto> {
    const user = await this.usersService.findUserById(createPostDto.userId);

    if (!user) {
      throw new NotFoundException(
        `User with ID ${createPostDto.userId} not found`,
      );
    }
    const post = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(post);
    return savedPost;
  }

  async getAllPosts(
    userId: number,
    pagination: PostsPaginationDto,
  ): Promise<PostResponseDto[]> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const posts = await this.postRepository.find({
      where: { userId },
      take: limit,
      skip,
      order: { createdAt: 'DESC' },
    });

    return posts;
  }

  async getPostById(postId: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }
}
