import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateCommentResponseDto,
  GetCommentsResponseDto,
} from './dto/response.dto';
import { Comment } from './entities/comment.entity';
import { ICommentsService } from './interfaces/comments.interface';

@Injectable()
export class CommentsService implements ICommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreateCommentResponseDto> {
    try {
      const existingComment = await this.findExistingComment(userId, postId);

      if (existingComment) {
        return this.addToExistingComment(existingComment, content);
      }

      return this.createNewComment(userId, postId, content);
    } catch (error) {
      this.logger.error(
        `Failed to create comment: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
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
  ): Promise<CreateCommentResponseDto> {
    existingComment.comments.push(content);
    const savedComment = await this.commentRepository.save(existingComment);
    return CreateCommentResponseDto.fromEntity(savedComment);
  }

  private async createNewComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreateCommentResponseDto> {
    const newComment = this.commentRepository.create({
      user: { id: userId },
      post: { id: postId },
      comments: [content],
    });

    const savedComment = await this.commentRepository.save(newComment);
    return CreateCommentResponseDto.fromEntity(savedComment);
  }

  async getComments(postId: number): Promise<GetCommentsResponseDto> {
    try {
      const comments = await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: ['user', 'post'],
        order: { id: 'DESC' },
      });

      if (!comments || comments.length === 0) {
        return GetCommentsResponseDto.fromEntities([]);
      }

      return GetCommentsResponseDto.fromEntities(comments);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve comments: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
