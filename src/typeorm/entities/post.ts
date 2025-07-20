import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity({ name: 'post' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  caption: string;

  @Column()
  imageUrl: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany('Comment', 'post')
  comments: any[];

  @OneToMany('Like', 'post')
  likes: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
