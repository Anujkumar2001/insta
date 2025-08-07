import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { plainToInstance } from 'class-transformer';
import { PostService } from 'src/post/post.service';
import { UsersService } from 'src/users/users.service';
import { CommentResponseDto } from './dto/comment.response.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly usersService: UsersService,
    private readonly postService: PostService,
  ) {}

  async createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CommentResponseDto> {
    await this.validateUserExists(userId);

    const isPostExists = await this.postService.getPostById(postId);

    if (!isPostExists) {
      throw new NotFoundException('Post not found');
    }

    const existingComment = await this.findExistingComment(userId, postId);

    if (existingComment) {
      return this.addToExistingComment(existingComment, content);
    }

    return this.createNewComment(userId, postId, content);
  }

  private async findExistingComment(
    userId: number,
    postId: number,
  ): Promise<Comment | null> {
    return this.commentRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });
  }

  private async addToExistingComment(
    existingComment: Comment,
    content: string,
  ): Promise<CommentResponseDto> {
    existingComment.comments.push(content);
    const savedComment = await this.commentRepository.save(existingComment);
    return plainToInstance(CommentResponseDto, {
      id: savedComment.id,
      comments: savedComment.comments,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,
    });
  }

  private async createNewComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CommentResponseDto> {
    const newComment = this.commentRepository.create({
      user: { id: userId },
      post: { id: postId },
      comments: [content],
    });

    const savedComment = await this.commentRepository.save(newComment);

    const response = plainToInstance(CommentResponseDto, {
      id: savedComment.id,
      comments: savedComment.comments,
      createdAt: savedComment.createdAt,
      updatedAt: savedComment.updatedAt,
    });

    return response;
  }

  async getComments(postId: number): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { id: 'DESC' },
    });

    if (!comments || comments.length === 0) {
      return [];
    }

    return comments.map((comment) => {
      return plainToInstance(CommentResponseDto, {
        id: comment.id,
        user: comment.user,
        comments: comment.comments,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      });
    });
  }

  private async validateUserExists(userId: number): Promise<void> {
    const isUserExists = await this.usersService.findUserById(userId);
    if (!isUserExists) {
      throw new NotFoundException('User not found');
    }
  }
}
