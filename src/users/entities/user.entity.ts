import { Follower } from 'src/followers/entity/follower.entity';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/post/modules/comments/entities/comment.entity';
import { Like } from 'src/post/modules/likes/entities/likes.entity';
import { Story } from 'src/story/entities/story.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follower, (f) => f.follower)
  following: Follower[];

  @OneToMany(() => Follower, (f) => f.following)
  followers: Follower[];

  @OneToMany(() => Story, (story) => story.user)
  stories: Story[];
  sub: number;
}
