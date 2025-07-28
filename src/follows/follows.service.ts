import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Follows from './entities/follows.entity';

@Injectable()
export class FollowsService {
  private readonly logger = new Logger(FollowsService.name);

  constructor(
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
  ) {}

  async createFollow(followerId: number, followingId: number) {
    try {
      const follow = this.followsRepository.create({
        followerId,
        followingId,
      });

      return this.followsRepository.save(follow);
    } catch (error) {
      this.logger.error(
        `Failed to create follow: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async deleteFollow(followerId: number, followingId: number) {
    try {
      const follow = this.followsRepository.create({
        followerId,
        followingId,
      });

      return this.followsRepository.remove(follow);
    } catch (error) {
      this.logger.error(
        `Failed to delete follow: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }
}
