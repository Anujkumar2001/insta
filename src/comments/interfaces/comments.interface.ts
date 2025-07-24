import {
  CreateCommentResponseDto,
  GetCommentsResponseDto,
} from '../dto/response.dto';

export interface ICommentsService {
  createComment(
    userId: number,
    postId: number,
    content: string,
  ): Promise<CreateCommentResponseDto>;
  getComments(postId: number): Promise<GetCommentsResponseDto>;
}

export interface CommentResponse {
  id: number;
  comments: string[];
  userId: number;
  username?: string;
  postId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
