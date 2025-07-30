import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '../entities/comment.entity';
import { Exclude, Expose, Type } from 'class-transformer';

/**
 * Base response DTO that all API responses should extend
 */
@Exclude()
export class BaseResponseDto<T> {
  @ApiProperty({ description: 'Indicates if the request was successful' })
  @Expose()
  success: boolean;

  @ApiProperty({ description: 'Response message' })
  @Expose()
  message: string;

  @ApiProperty({ description: 'Response data' })
  @Expose()
  data: T;

  @ApiProperty({ description: 'Timestamp of the response' })
  @Expose()
  timestamp: string;

  constructor(partial: Partial<BaseResponseDto<T>>) {
    Object.assign(this, partial);
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): BaseResponseDto<T> {
    return new BaseResponseDto<T>({
      success: true,
      message,
      data,
    });
  }

  static error<T>(message: string, data: T | null = null): BaseResponseDto<T> {
    return new BaseResponseDto<T>({
      success: false,
      message,
      data: data as T,
    });
  }
}

/**
 * User data included in comment responses
 */
export class CommentUserDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User display name' })
  name: string;
}

/**
 * Comment data transfer object
 */
export class CommentDto {
  @ApiProperty({ description: 'Comment ID' })
  id: number;

  @ApiProperty({
    description: 'Array of comment texts',
    example: ['First comment', 'Second comment'],
  })
  comments: string[];

  @ApiProperty({
    description: 'User who created the comment',
    type: CommentUserDto,
  })
  user: CommentUserDto;

  @ApiProperty({ description: 'Post ID the comment belongs to' })
  postId: number;

  static fromEntity(comment: Comment): CommentDto {
    const dto = new CommentDto();
    dto.id = comment.id;
    dto.comments = comment.comments || [];
    dto.user = {
      id: comment.user?.id,
      name: comment.user?.name || 'Unknown User'
    };
    dto.postId = comment.post?.id;
    return dto;
  }
}

/**
 * Response DTO for creating a comment
 */
export class CreateCommentResponseDto extends BaseResponseDto<CommentDto> {
  @ApiProperty({ type: CommentDto })
  @Type(() => CommentDto)
  declare data: CommentDto;

  static fromEntity(comment: Comment): CreateCommentResponseDto {
    return BaseResponseDto.success(
      CommentDto.fromEntity(comment),
      'Comment created successfully'
    ) as CreateCommentResponseDto;
  }
}

/**
 * Response DTO for getting multiple comments
 */
export class GetCommentsResponseDto extends BaseResponseDto<CommentDto[]> {
  @ApiProperty({
    type: [CommentDto],
    description: 'Array of comments',
  })
  @Type(() => CommentDto)
  declare data: CommentDto[];

  static fromEntities(comments: Comment[]): GetCommentsResponseDto {
    return BaseResponseDto.success<CommentDto[]>(
      comments.map((comment) => CommentDto.fromEntity(comment)),
      'Comments retrieved successfully',
    ) as GetCommentsResponseDto;
  }
}
