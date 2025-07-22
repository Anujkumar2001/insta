/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    try {
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
    } catch (error) {
      console.error('Create User Error:', error);
      return { message: 'Internal server error', statusCode: 500 };
    }
  }
}
