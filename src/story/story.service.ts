/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { FollowersService } from 'src/followers/followers.service';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { FollowingStoriesResponseDto } from './dto/following-stories-response.dto';
import { StoryDetailsDto } from './dto/story-details.dto';
import { StoryResponseDto } from './dto/story-response.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryView } from './entities/story-view.entity';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
    @InjectRepository(StoryView)
    private readonly storyViewRepository: Repository<StoryView>,
    private readonly followersService: FollowersService,
  ) {}

  async create(createStoryDto: CreateStoryDto, userId: number): Promise<Story> {
    const story = this.storyRepository.create({ ...createStoryDto, userId });
    return await this.storyRepository.save(story);
  }

  private async findOne(id: number): Promise<Story> {
    const story = await this.storyRepository.findOne({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async getStoryDetails(id: number): Promise<StoryDetailsDto> {
    const story = await this.storyRepository.findOneBy({ id });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const viewCount = await this.storyViewRepository.count({
      where: { storyId: id },
    });

    const views = await this.storyViewRepository.find({
      where: { storyId: id },
      relations: ['user'],
      order: { viewedAt: 'DESC' },
    });

    return plainToInstance(StoryDetailsDto, {
      ...story,
      viewCount,
      views: views.map((view) => ({
        id: view.id,
        viewedAt: view.viewedAt,
        user: {
          id: view.user.id,
          name: view.user.name,
          email: view.user.email,
        },
      })),
    });
  }

  async findStoriesByUser(userId: number): Promise<StoryResponseDto[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const stories = await this.storyRepository.find({
      where: {
        userId,
        createdAt: MoreThan(oneDayAgo),
        isArchived: false,
      },
      order: { createdAt: 'DESC' },
    });

    return plainToInstance(StoryResponseDto, stories);
  }

  async update(
    id: number,
    updateDto: UpdateStoryDto,
    userId: number,
  ): Promise<Story> {
    const story = await this.findOne(id);

    if (story.userId !== userId) {
      throw new ForbiddenException('permission denied');
    }

    Object.assign(story, updateDto);
    return await this.storyRepository.save(story);
  }

  async remove(id: number, userId: number): Promise<void> {
    const story = await this.findOne(id);
    if (story.userId !== userId) {
      throw new ForbiddenException('permission denied');
    }
    await this.storyRepository.remove(story);
  }

  private async findFollowingStories(userId: number): Promise<Story[]> {
    const followingRelations = await this.followersService.getFollowing(
      userId,
      { limit: 10, offset: 0 },
    );

    const followingIds = followingRelations.map(
      (relation) => relation.following.id,
    );

    if (followingIds.length === 0) {
      return [];
    }

    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return await this.storyRepository.find({
      where: {
        userId: In(followingIds),
        createdAt: MoreThan(oneDayAgo),
        isArchived: false,
      },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async viewStory(userId: number, storyId: number): Promise<StoryView> {
    await this.findOne(storyId);

    const existingView = await this.storyViewRepository.findOne({
      where: { userId, storyId },
    });

    if (existingView) {
      return existingView;
    }

    const storyView = this.storyViewRepository.create({
      userId,
      storyId,
    });

    return await this.storyViewRepository.save(storyView);
  }

  private async getViewedStories(userId: number): Promise<number[]> {
    const views = await this.storyViewRepository.find({
      where: { userId },
      select: ['storyId'],
    });

    return views.map((view) => view.storyId);
  }

  async getFollowingStoriesWithViewStatus(
    userId: number,
  ): Promise<FollowingStoriesResponseDto[]> {
    const followingStories = await this.findFollowingStories(userId);
    const viewedStoryIds = await this.getViewedStories(userId);

    const result = followingStories.map((story) => ({
      story,
      viewed: viewedStoryIds.includes(story.id),
    }));

    return plainToInstance(FollowingStoriesResponseDto, result);
  }
}
