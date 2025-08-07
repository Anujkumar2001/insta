import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { FollowResponseDto } from './dto/follow-response.dto';
import { FollowUserDto } from './dto/follow-user.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { UnfollowUserDto } from './dto/unFollow-user.dto';
import { Follower } from './entity/follower.entity';

@Injectable()
export class FollowersService {
  constructor(
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
    private readonly usersService: UsersService,
  ) {}

  async followUser(
    userId: number,
    followUserDto: FollowUserDto,
  ): Promise<FollowResponseDto> {
    const followerId = userId;
    const followingId = followUserDto.userId;

    await this.validateUserExists(followerId, 'Follower');
    await this.validateUserExists(followingId, 'Following');

    if (followerId === followingId) {
      throw new HttpException(
        'You cannot follow yourself',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if already following
    const existingFollow = await this.followerRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new HttpException(
        'You are already following this user',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check if target user exists
    const targetUser = await this.usersService.findUserById(followingId);
    if (!targetUser) {
      throw new NotFoundException('User to follow not found');
    }

    const follower = await this.usersService.findUserById(followerId);
    if (!follower) {
      throw new NotFoundException('Follower user not found');
    }

    const savedFollow = await this.followerRepository.save({
      follower,
      following: targetUser,
    });

    return {
      followerId: savedFollow.follower.id,
      followingId: savedFollow.following.id,
      followedAt: savedFollow.createdAt,
    };
  }

  async unfollowUser(
    userId: number,
    unfollowUserDto: UnfollowUserDto,
  ): Promise<void> {
    await this.validateUserExists(userId, 'Follower');
    await this.validateUserExists(unfollowUserDto.userId, 'Following');
    const result = await this.followerRepository.delete({
      follower: { id: userId },
      following: { id: unfollowUserDto.userId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Follow relationship not found');
    }
  }

  async getFollowers(
    userId: number,
    pagination: PaginationQueryDto,
  ): Promise<any[]> {
    const { limit = 10, offset = 0 } = pagination;

    const followers = await this.followerRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return followers;
  }

  async getFollowing(
    userId: number,
    pagination: PaginationQueryDto,
  ): Promise<any[]> {
    const { limit = 10, offset = 0 } = pagination;

    const following = await this.followerRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });

    return following;
  }

  async isFollowing(userId: number, targetUserId: number): Promise<boolean> {
    const count = await this.followerRepository.count({
      where: {
        follower: { id: userId },
        following: { id: targetUserId },
      },
    });

    return count > 0;
  }
  private async validateUserExists(
    userId: number,
    context: string,
  ): Promise<void> {
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException(`${context} user not found`);
    }
  }
}
