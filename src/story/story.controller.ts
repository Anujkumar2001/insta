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
  create(@Body() createDto: CreateStoryDto, @UserDetails() user: User) {
    return this.storyService.create(createDto, user.id);
  }

  @Get()
  findAll() {
    return this.storyService.findAll();
  }

  @Get('user/:userId')
  findStoriesByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.storyService.findStoriesByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateStoryDto,
  ) {
    return this.storyService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.storyService.remove(id);
  }
}
