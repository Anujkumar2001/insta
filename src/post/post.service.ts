import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private userService: UsersService,
  ) {}

  async createPost(
    caption: string,
    imgUrl: string,
    location: string,
    userId: number,
  ) {
    const user = await this.userService.findUserById(userId);
    if (user) {
      const post = new Post();
      post.caption = caption;
      post.imgUrl = imgUrl;
      post.location = location;
      post.userId = userId;
      try {
        const savedPost = await this.postRepository.save(post);
        return savedPost;
      } catch (error) {
        console.error('Error creating post:', error);
        throw error;
      }
    } else {
      throw new NotFoundException('User not found');
    }
  }
  async getAllPost(userId: number) {
    const allPost = this.postRepository.find({ where: { userId } });
    return allPost;
  }

  async getPostById(postId: number) {
    const post = this.postRepository.findOne({ where: { id: postId } });
    return post;
  }
}
