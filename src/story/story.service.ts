import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { Story } from './entities/story.entity';

@Injectable()
export class StoryService {
  constructor(
    @InjectRepository(Story)
    private readonly storyRepository: Repository<Story>,
  ) {}

  async create(createStoryDto: CreateStoryDto, userId: number): Promise<Story> {
    const story = this.storyRepository.create({ ...createStoryDto, userId });
    return await this.storyRepository.save(story);
  }

  async findAll(): Promise<Story[]> {
    return await this.storyRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: number): Promise<Story> {
    const story = await this.storyRepository.findOne({ where: { id } });
    if (!story) throw new NotFoundException('Story not found');
    return story;
  }

  async findStoriesByUser(userId: number): Promise<Story[]> {
    return await this.storyRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateDto: UpdateStoryDto): Promise<Story> {
    const story = await this.findOne(id);
    Object.assign(story, updateDto);
    console.log(story);
    return await this.storyRepository.save(story);
  }

  async remove(id: number): Promise<void> {
    const story = await this.findOne(id);
    await this.storyRepository.remove(story);
  }
}
