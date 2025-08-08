/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfileDto } from './dto/user-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserWithPassword(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  async createUser(
    email: string,
    password: string,
    name: string,
  ): Promise<User | any> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'User already exists with this email',
        statusCode: 400,
      };
    }

    const user = this.userRepository.create({ email, password, name });
    return await this.userRepository.save(user);
  }

  async findUserById(userId: number): Promise<UserProfileDto> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.name'])
      .where('user.id = :userId', { userId })
      .getOne();
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
}
