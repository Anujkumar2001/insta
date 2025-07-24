import { Like } from '../entities/likes.entity';
import { LikeResponse } from '../interfaces/likes.interface';

export class BaseResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: Date;

  constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date();
  }

  static success<T>(
    data: T,
    message = 'Operation successful',
  ): BaseResponseDto<T> {
    return new BaseResponseDto<T>(true, message, data);
  }

  static error<T>(
    message = 'Operation failed',
    data: T = {} as T,
  ): BaseResponseDto<T> {
    return new BaseResponseDto<T>(false, message, data);
  }
}

export class CreateLikeResponseDto extends BaseResponseDto<LikeResponse> {
  static fromEntity(
    like: Like,
    message = 'Like created successfully',
  ): CreateLikeResponseDto {
    const response: LikeResponse = {
      id: like.id,
      userId: like.userId,
      postId: like.postId,
      createdAt: like.createdAt,
      updatedAt: like.updatedAt,
    };
    return BaseResponseDto.success(response, message);
  }

  static alreadyLiked(): CreateLikeResponseDto {
    return BaseResponseDto.error(
      'Post already liked by this user',
      {} as LikeResponse,
    );
  }

  static userNotFound(userId: number): CreateLikeResponseDto {
    return BaseResponseDto.error(
      `User with ID ${userId} does not exist`,
      {} as LikeResponse,
    );
  }

  static postNotFound(postId: number): CreateLikeResponseDto {
    return BaseResponseDto.error(
      `Post with ID ${postId} does not exist`,
      {} as LikeResponse,
    );
  }
}

export class GetLikesResponseDto extends BaseResponseDto<{
  totalLikes: number;
  userHasLiked?: boolean;
}> {
  static fromCount(
    totalLikes: number,
    userHasLiked?: boolean,
  ): GetLikesResponseDto {
    return BaseResponseDto.success(
      { totalLikes, userHasLiked },
      'Likes retrieved successfully',
    );
  }
}
