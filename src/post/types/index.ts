export interface CreatePostDto {
  caption: string;
  imgUrl: string;
  location: string;
  userId: number;
}

export interface RequestWithUser extends Request {
  user: {
    sub: number;
    email: string;
    [key: string]: any;
  };
}
