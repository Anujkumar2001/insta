import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserDetails } from 'src/core/common/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { StoryService } from './story.service';

@UseGuards(AuthGuard)
@Controller('stories')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Post()
  createStory(@Body() createDto: CreateStoryDto, @UserDetails() user: User) {
    return this.storyService.create(createDto, user.id);
  }

  @Get()
  findAllStories() {
    return this.storyService.findAll();
  }

  @Get('following')
  getFollowingStories(@UserDetails() user: User) {
    return this.storyService.getFollowingStoriesWithViewStatus(user.id);
  }

  @Get('user/:userId')
  findStoriesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.storyService.findStoriesByUser(userId);
  }

  @Get('me')
  getStoryDetails(@UserDetails() user: User) {
    return this.storyService.findStoriesByUser(user.id);
  }

  @Patch(':id')
  updateStory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateStoryDto,
    @UserDetails() user: User,
  ) {
    return this.storyService.update(id, updateDto, user.id);
  }

  @Delete(':id')
  removeStory(
    @Param('id', ParseIntPipe) id: number,
    @UserDetails() user: User,
  ) {
    return this.storyService.remove(id, user.id);
  }

  @Post('view/:id')
  viewStory(@Param('id', ParseIntPipe) id: number, @UserDetails() user: User) {
    return this.storyService.viewStory(user.id, id);
  }

  @Get('me')
  getMyStories(@UserDetails() user: User) {
    return this.storyService.findStoriesByUser(user.id);
  }
}
