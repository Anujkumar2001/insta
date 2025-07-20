import {
  Body,
  Controller,
  Delete,
  Get,
  Post as HttpPost,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CreateProfileDto } from 'src/users/dtos/CreateProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UserService } from '../../service/user/user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.findUser();
  }

  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @HttpPost()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @HttpPost(':id/profile')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createProfileDto: CreateProfileDto,
  ) {
    return this.userService.createProfile(id, createProfileDto);
  }

  @Put(':id/profile')
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: CreateProfileDto,
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
  }
}
