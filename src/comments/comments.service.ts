import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentResponseDto } from './dto/comment.response.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger(CommentsService.name);

  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<any> {
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
  ): Promise<any> {
    existingComment.comments.push(content);
    const savedComment = await this.commentRepository.save(existingComment);
    return savedComment;
  }

  private async createNewComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<any> {
    const newComment = this.commentRepository.create({
      user: { id: userId },
      post: { id: postId },
      comments: [content],
    });

    const savedComment = await this.commentRepository.save(newComment);
    return savedComment;
  }

  async getComments(postId: number): Promise<CommentResponseDto[]> {
    try {
      const comments = await this.commentRepository.find({
        where: { post: { id: postId } },
        relations: ['user'],
        order: { id: 'DESC' }, // Using id for ordering as it's guaranteed to exist
      });

      if (!comments || comments.length === 0) {
        return [];
      }

      return comments.map(
        (comment) =>
          new CommentResponseDto({
            ...comment,
            user: {
              id: comment.user.id,
              name: comment.user.name,
              email: comment.user.email,
            },
          }),
      );
    } catch (error) {
      this.logger.error(
        `Failed to retrieve comments: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
