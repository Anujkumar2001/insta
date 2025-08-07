import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  caption: string;

  @Column({ type: 'varchar', length: 255 })
  mediaUrl: string;

  @Column({
    type: 'enum',
    enum: ['image', 'video'],
    nullable: true,
  })
  mediaType: 'image' | 'video';

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @CreateDateColumn()
  @Index()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @ManyToOne(() => User, (user: User) => user.stories, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column()
  userId: number;
}
