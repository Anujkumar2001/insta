export interface LikeResponse {
  id: number;
  userId: number;
  postId: number;
  userName?: string;
  postTitle?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
