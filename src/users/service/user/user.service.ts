import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/profile';
import { User } from 'src/typeorm/entities/user';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { CreateUserProfileParams } from 'src/users/utility/types';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../dtos/CreateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
  ) {}

  async updateProfile(userId: number, updateProfileDto: any) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });
    if (!user) throw new Error('User not found');
    if (!user.profile) throw new Error('Profile not found');
    Object.assign(user.profile, updateProfileDto);
    await this.profileRepository.save(user.profile);
    return user.profile;
  }

  async findUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      ...createUserDto,
      createdAt: new Date(),
    });

    return this.userRepository.save(user);
  }
  async updateUser(id: number, userDetails: UpdateUserDto) {
    await this.userRepository.update(id, userDetails);
  }
  async deleteUser(id: number) {
    await this.userRepository.delete({
      id,
    });
  }

  async createProfile(id: number, userProfile: CreateUserProfileParams) {
    console.log({ userProfile });
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return 'user not exist';
    const newProfile = this.profileRepository.create(userProfile);
    const savedProfile = await this.profileRepository.save(newProfile);
    user.profile = savedProfile;
    return this.userRepository.save(user);
  }
}
