export interface CommentResponse {
  id: number;
  comments: string[];
  userId: number;
  username?: string;
  postId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
