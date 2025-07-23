import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostService } from 'src/post/post.service';
import { Repository } from 'typeorm';
import { Like } from './entities/likes.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likesRepository: Repository<Like>,
    private postService: PostService,
  ) {}
  async createLike(postId: number, userId: number) {
    let like = await this.likesRepository.findOne({
      where: { post: { id: postId } },
      relations: ['post'],
    });
    if (like) {
      // If like exists, increment the count
      like.likesCount += 1;
    } else {
      // If no like exists, create a new one
      const newLike = this.likesRepository.create({
        likesCount: 1,
        post: { id: postId }, // This will automatically set the post relation
        userId,
      });
      like = newLike;
    }
    return this.likesRepository.save(like);
  }
}
