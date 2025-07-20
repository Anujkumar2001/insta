import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/typeorm/entities/comment';
import { Post } from 'src/typeorm/entities/post';
import { User } from 'src/typeorm/entities/user';
import { CreateCommentDto } from 'src/users/dtos/CreateComment.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createComment(
    userId: number,
    postId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const comment = this.commentRepository.create({ ...dto, user, post });
    return this.commentRepository.save(comment); // This returns a single Comment entity
  }

  async getPostComments(postId: number): Promise<Comment[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['comments', 'comments.user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post.comments ? post.comments : [];
  }

  async deleteComment(
    userId: number,
    commentId: number,
  ): Promise<{ message: string }> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.user.id !== userId)
      throw new ForbiddenException('You can only delete your own comments');
    await this.commentRepository.remove(comment);
    return { message: 'Comment deleted successfully' };
  }
}
