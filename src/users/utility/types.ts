export type CreateUserParams = {
  username: string;
  name: string;
  email: string;
  password: string;
};

export type CreateUserProfileParams = {
  bio?: string;
  website?: string;
  profilePicture?: string;
  phone?: string;
  gender?: string;
  isPrivate?: boolean;
};

export type CreatePostParams = {
  caption?: string;
  imageUrl: string;
};

export type CreateCommentParams = {
  content: string;
};
