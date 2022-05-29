import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'blogs' })
export class BlogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: '' })
  image: string;

  @Column({ default: 0 })
  likes: number;

  @Column('simple-array')
  tagList: string[];

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  updateTimestamp() {
    this.updatedAt = new Date();
  }

  @ManyToOne(() => UserEntity, (auth) => auth.blogs, { eager: true })
  author: UserEntity;
}
