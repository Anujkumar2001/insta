import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/typeorm/entities/like';
import { Post } from 'src/typeorm/entities/post';
import { User } from 'src/typeorm/entities/user';
import { Repository } from 'typeorm';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private likeRepository: Repository<Like>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async likePost(userId: number, postId: number): Promise<Like> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    if (existingLike)
      throw new ConflictException('You have already liked this post');
    const like = this.likeRepository.create({ user, post });
    return this.likeRepository.save(like);
  }

  async unlikePost(
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const like = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });
    if (!like) throw new NotFoundException('You have not liked this post');
    await this.likeRepository.remove(like);
    return { message: 'Post unliked successfully' };
  }

  async getPostLikes(postId: number): Promise<Like[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['likes', 'likes.user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post.likes || [];
  }
}
