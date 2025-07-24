import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}
  async createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<Comment> {
    let existingComment = await this.commentRepository.findOne({
      where: {
        user: { id: userId },
        post: { id: postId },
      },
    });

    if (existingComment) {
      existingComment.comments.push(content);
      return this.commentRepository.save(existingComment);
    }

    const newComment = this.commentRepository.create({
      user: { id: userId },
      post: { id: postId },
      comments: [content],
    });

    return this.commentRepository.save(newComment);
  }

  async getComments(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
      order: { id: 'DESC' },
    });
  }
}
