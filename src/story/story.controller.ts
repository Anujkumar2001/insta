import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiEnvelopeResponse } from 'src/core/common/decorators/api-envelope-response.decorator';
import { UserDetails } from 'src/core/common/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { FollowingStoriesResponseDto } from './dto/following-stories-response.dto';
import { StoryResponseDto } from './dto/story-response.dto';
import { StoryViewResponseDto } from './dto/story-view-response.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryView } from './entities/story-view.entity';
import { Story } from './entities/story.entity';
import { StoryService } from './story.service';

@UseGuards(AuthGuard)
@ApiTags('stories')
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiEnvelopeResponse(StoryResponseDto, HttpStatus.CREATED)
  async createStory(
    @Body(ValidationPipe) createDto: CreateStoryDto,
    @UserDetails() user: User,
  ): Promise<Story> {
    return this.storyService.create(createDto, user.id);
  }

  @Get('following')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(FollowingStoriesResponseDto, HttpStatus.OK)
  async getFollowingStories(@UserDetails() user: User): Promise<any[]> {
    return this.storyService.getFollowingStoriesWithViewStatus(user.id);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(StoryResponseDto, HttpStatus.OK)
  async findStoriesByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Story[]> {
    return this.storyService.findStoriesByUser(userId);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(StoryResponseDto, HttpStatus.OK)
  async getMyStories(@UserDetails() user: User): Promise<Story[]> {
    return this.storyService.findStoriesByUser(user.id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(StoryResponseDto, HttpStatus.OK)
  async updateStory(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDto: UpdateStoryDto,
    @UserDetails() user: User,
  ): Promise<Story> {
    return this.storyService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiEnvelopeResponse(Object, HttpStatus.NO_CONTENT)
  async removeStory(
    @Param('id', ParseIntPipe) id: number,
    @UserDetails() user: User,
  ): Promise<void> {
    return this.storyService.remove(id, user.id);
  }

  @Post('view/:id')
  @HttpCode(HttpStatus.OK)
  @ApiEnvelopeResponse(StoryViewResponseDto, HttpStatus.OK)
  async viewStory(
    @Param('id', ParseIntPipe) id: number,
    @UserDetails() user: User,
  ): Promise<StoryView> {
    return this.storyService.viewStory(user.id, id);
  }
}
