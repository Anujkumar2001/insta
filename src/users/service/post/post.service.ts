import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/post';
import { User } from 'src/typeorm/entities/user';
import { CreatePostDto } from 'src/users/dtos/CreatePost.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createPost(
    userId: number,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const post = this.postRepository.create({ ...createPostDto, user });
    return this.postRepository.save(post);
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'comments', 'likes'],
    });
  }

  async getPostById(postId: number): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user', 'comments', 'likes'],
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async getPostsByUserId(userId: number): Promise<Post[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.postRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'comments', 'likes'],
    });
  }

  async updatePost(
    userId: number,
    postId: number,
    updatePostDto: Partial<CreatePostDto>,
  ): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId)
      throw new ForbiddenException('You can only update your own posts');
    Object.assign(post, updatePostDto);
    return this.postRepository.save(post);
  }

  async deletePost(
    userId: number,
    postId: number,
  ): Promise<{ message: string }> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== userId)
      throw new ForbiddenException('You can only delete your own posts');
    await this.postRepository.remove(post);
    return { message: 'Post deleted successfully' };
  }
}
