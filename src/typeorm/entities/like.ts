import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from './post';
import { User } from './user';

@Entity({ name: 'like' })
@Unique(['user', 'post']) // Ensures a user can like a post only once
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Post)
  post: Post;

  @CreateDateColumn()
  createdAt: Date;
}
