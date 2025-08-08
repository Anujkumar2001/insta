/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiEnvelopeResponse } from 'src/core/common/decorators/api-envelope-response.decorator';
import { ApiResponseDto } from 'src/core/common/dto/api.response.dto';
import { FollowResponseDto } from './dto/follow-response.dto';
import { IsFollowingResponseDto } from './dto/is-following-response.dto';
import { UnfollowResponseDto } from './dto/unfollow-response.dto';
import { UserSummaryDto } from './dto/user-summary.dto';

import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { UserDetails } from 'src/core/common/decorators/user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FollowersService } from './followers.service';

@ApiTags('followers')
@ApiExtraModels(
  ApiResponseDto,
  FollowResponseDto,
  UnfollowResponseDto,
  UserSummaryDto,
  IsFollowingResponseDto,
)
@Controller('followers')
@UseGuards(AuthGuard)
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':targetUserId')
  @ApiEnvelopeResponse(FollowResponseDto)
  async followUser(
    @UserDetails() user: User,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<FollowResponseDto> {
    return await this.followersService.followUser(user.id, {
      userId: targetUserId,
    });
  }

  @Delete(':targetUserId')
  @ApiEnvelopeResponse(UnfollowResponseDto)
  async unfollowUser(
    @GetUser() user: User,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<UnfollowResponseDto> {
    return await this.followersService.unfollowUser(user.id, {
      userId: targetUserId,
    });
  }

  @Get('me')
  @ApiEnvelopeResponse(UserSummaryDto, 200)
  async getMyFollowers(
    @UserDetails() user: User,
    @Query() pagination: PaginationQueryDto,
  ): Promise<UserSummaryDto[]> {
    return await this.followersService.getFollowers(user.id, pagination);
  }

  @Get('me/following')
  @ApiEnvelopeResponse(UserSummaryDto, 200)
  async getMyFollowing(
    @UserDetails() user: User,
    @Query() pagination: PaginationQueryDto,
  ): Promise<UserSummaryDto[]> {
    return await this.followersService.getFollowing(user.id, pagination);
  }

  @Get(':userId')
  @ApiEnvelopeResponse(UserSummaryDto, 200)
  async getUserFollowers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<UserSummaryDto[]> {
    return await this.followersService.getFollowers(userId, pagination);
  }

  @Get(':userId/following')
  @ApiEnvelopeResponse(UserSummaryDto, 200)
  async getUserFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<UserSummaryDto[]> {
    return await this.followersService.getFollowing(userId, pagination);
  }

  @Get(':userId/is-following/:targetId')
  @ApiEnvelopeResponse(IsFollowingResponseDto, 200)
  async isFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('targetId', ParseIntPipe) targetId: number,
  ): Promise<IsFollowingResponseDto> {
    const isFollowing = await this.followersService.isFollowing(
      userId,
      targetId,
    );
    return { isFollowing };
  }
}
