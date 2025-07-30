import { Expose } from 'class-transformer';

export class PostResponseDto {
  @Expose()
  id: number;

  @Expose()
  caption: string;

  @Expose()
  imgUrl: string;

  @Expose()
  location: string;

  @Expose({ name: 'userId' })
  userId: number;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }

  @Expose()
  updatedAt: Date;
}
