export interface CreatePostDto {
  caption: string;
  imgUrl: string;
  location: { lat: number; lng: number };
  userId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
}
