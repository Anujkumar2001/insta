/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../users/entities/user.entity';
import { FollowResponseDto } from './dto/follow-response.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FollowersService } from './followers.service';

@ApiTags('followers')
@ApiBearerAuth()
@Controller('followers')
@UseGuards(AuthGuard)
export class FollowersController {
  constructor(private readonly followersService: FollowersService) {}

  @Post(':targetUserId')
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: 201,
    description: 'Successfully followed user',
    type: FollowResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async followUser(
    @GetUser() user: User,
    @Param('targetUserId', ParseIntPipe) targetUserId: number,
  ): Promise<FollowResponseDto> {
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
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({ status: 200, description: 'Successfully unfollowed user' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Follow relationship not found' })
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
  @ApiOperation({ summary: 'Get my followers' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of followers',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyFollowers(
    @GetUser() user: User,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowers(user.id, pagination);
  }

  @Get('me/following')
  @ApiOperation({ summary: 'Get users I am following' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of followed users',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMyFollowing(
    @GetUser() user: User,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowing(user.id, pagination);
  }

  @Get(':userId')
  @ApiOperation({ summary: "Get a user's followers" })
  @ApiResponse({
    status: 200,
    description: "Returns list of user's followers",
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserFollowers(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowers(userId, pagination);
  }

  @Get(':userId/following')
  @ApiOperation({ summary: 'Get users that a user is following' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of followed users',
    type: [User],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserFollowing(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() pagination: PaginationQueryDto,
  ): Promise<User[]> {
    return this.followersService.getFollowing(userId, pagination);
  }

  @Get(':userId/is-following/:targetId')
  @ApiOperation({ summary: 'Check if a user is following another user' })
  @ApiResponse({
    status: 200,
    description: 'Returns follow status',
    type: Boolean,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
