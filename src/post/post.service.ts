import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { PostsPaginationDto } from './dto/posts-pagination.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  findPostById: any;
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async createPost(
    createPostDto: CreatePostDto & { userId: number },
  ): Promise<PostResponseDto> {
    try {
      const post = this.postRepository.create(createPostDto);
      const savedPost = await this.postRepository.save(post);
      return new PostResponseDto(savedPost);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to create post: ${errorMessage}`);
    }
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

    return posts.map((post) => new PostResponseDto(post));
  }

  async getPostById(postId: number): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return new PostResponseDto(post);
  }
}
