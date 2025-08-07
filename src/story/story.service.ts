import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower } from 'src/followers/entity/follower.entity';
import { In, MoreThan, Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
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
    @InjectRepository(Follower)
    private readonly followerRepository: Repository<Follower>,
  ) {}

  async create(createStoryDto: CreateStoryDto, userId: number): Promise<Story> {
    const story = this.storyRepository.create({ ...createStoryDto, userId });
    return await this.storyRepository.save(story);
  }

  async findAll(): Promise<Story[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return await this.storyRepository.find({
      where: {
        createdAt: MoreThan(oneDayAgo),
        isArchived: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.storyRepository.findOne({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async getStoryDetails(id: number): Promise<any> {
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
    return {
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
    };
  }

  async findStoriesByUser(userId: number): Promise<Story[]> {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    return await this.storyRepository.find({
      where: {
        userId,
        createdAt: MoreThan(oneDayAgo),
        isArchived: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateStoryDto): Promise<Story> {
    const story = await this.findOne(id);
    Object.assign(story, updateDto);
    return await this.storyRepository.save(story);
  }

  async remove(id: number): Promise<void> {
    const story = await this.findOne(id);
    await this.storyRepository.remove(story);
  }

  async findFollowingStories(userId: number): Promise<Story[]> {
    const followingRelations = await this.followerRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

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

  async getViewedStories(userId: number): Promise<number[]> {
    const views = await this.storyViewRepository.find({
      where: { userId },
      select: ['storyId'],
    });

    return views.map((view) => view.storyId);
  }

  async getFollowingStoriesWithViewStatus(userId: number): Promise<any[]> {
    const followingStories = await this.findFollowingStories(userId);
    const viewedStoryIds = await this.getViewedStories(userId);

    return followingStories.map((story) => ({
      ...story,
      viewed: viewedStoryIds.includes(story.id),
    }));
  }
}
