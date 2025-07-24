import {
  CreateLikeResponseDto,
  GetLikesResponseDto,
} from '../dto/response.dto';

export interface ILikesService {
  createLike(postId: number, userId: number): Promise<CreateLikeResponseDto>;
  getAllLikes(postId: number, userId?: number): Promise<GetLikesResponseDto>;
}

export interface LikeResponse {
  id: number;
  userId: number;
  postId: number;
  userName?: string;
  postTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
