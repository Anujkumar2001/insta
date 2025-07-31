/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDetails } from 'src/core/common/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FollowersService } from './followers.service';

@ApiTags('followers')
@Controller('followers')
@UseGuards(AuthGuard)
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':targetUserId')
  async followUser(
    @UserDetails() user: User,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    try {
      return await this.followersService.followUser(user.id, {
        userId: targetUserId,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Delete(':targetUserId')
  async unfollowUser(
    @GetUser() user: User,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ) {
    try {
      await this.followersService.unfollowUser(user.id, {
        userId: targetUserId,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('me')
  async getMyFollowers(
    @UserDetails() user: User,
    @Query() pagination: PaginationQueryDto,
  ) {
    return await this.followersService.getFollowers(user.id, pagination);
  }

  @Get('me/following')
  async getMyFollowing(
    @UserDetails() user: User,
    @Query() pagination: PaginationQueryDto,
  ) {
    return await this.followersService.getFollowing(user.id, pagination);
  }

  @Get(':userId')
  async getUserFollowers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return await this.followersService.getFollowers(userId, pagination);
  }

  @Get(':userId/following')
  async getUserFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ) {
    return await this.followersService.getFollowing(userId, pagination);
  }

  @Get(':userId/is-following/:targetId')
  async isFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ) {
    const isFollowing = await this.followersService.isFollowing(
      userId,
      targetId,
    );
    return { isFollowing };
  }
}
