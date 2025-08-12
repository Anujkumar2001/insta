import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { SignupResponseDto } from 'src/auth/dto/signup.response.dto';
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
  ): Promise<SignupResponseDto> {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new HttpException(
        'User already exists with this email',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = this.userRepository.create({ email, password, name });
    const savedUser = await this.userRepository.save(user);
    return plainToInstance(SignupResponseDto, savedUser);
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
    return plainToInstance(UserProfileDto, user);
  }
}
