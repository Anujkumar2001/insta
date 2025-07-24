import { Comment } from '../entities/comment.entity';
import { CommentResponse } from '../interfaces/comments.interface';

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

export class CreateCommentResponseDto extends BaseResponseDto<CommentResponse> {
  static fromEntity(comment: Comment): CreateCommentResponseDto {
    const response: CommentResponse = {
      id: comment.id,
      comments: comment.comments,
      userId: comment.user?.id,
      postId: comment.post?.id,
    };
    return BaseResponseDto.success(response, 'Comment created successfully');
  }
}

export class GetCommentsResponseDto extends BaseResponseDto<CommentResponse[]> {
  static fromEntities(comments: Comment[]): GetCommentsResponseDto {
    const responseData: CommentResponse[] = comments.map((comment) => {
      const user = comment.user;
      return {
        id: comment.id,
        comments: comment.comments,
        userId: user?.id,
        username: user?.name,
        postId: comment.post?.id,
      };
    });
    return BaseResponseDto.success(
      responseData,
      'Comments retrieved successfully',
    );
  }
}
