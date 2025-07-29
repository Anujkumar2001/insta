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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestWithUser } from 'src/post/types';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FollowResponseDto } from './dto/follow-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FollowersService } from './followers.service';

@ApiTags('followers')
@Controller('followers')
@UseGuards(AuthGuard)
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':targetUserId')
  async followUser(
    @Req() req: RequestWithUser,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<FollowResponseDto> {
    try {
      return await this.followersService.followUser(req.user.sub, {
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
  ): Promise<void> {
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
  getMyFollowers(
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowers(req.user.sub, pagination);
  }

  @Get('me/following')
  getMyFollowing(
    @Req() req: RequestWithUser,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowing(req.user.sub, pagination);
  }

  @Get(':userId')
  getUserFollowers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowers(userId, pagination);
  }

  @Get(':userId/following')
  getUserFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowing(userId, pagination);
  }

  @Get(':userId/is-following/:targetId')
  async isFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<{ isFollowing: boolean }> {
    const isFollowing = await this.followersService.isFollowing(
      userId,
      targetId,
    );
    return { isFollowing };
  }
}
