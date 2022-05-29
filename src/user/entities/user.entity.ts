import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BlogEntity } from '../../blog/entities/blog.entity';
import { UserType } from '../types/user.type';

export enum Role {
  ADMIN = 'ADMIN',
  MASTER = 'MASTER',
  USER = 'USER',
  GHOST = 'GHOST',
}

@Entity({ name: 'users' })
export class UserEntity implements UserType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text' })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: null, select: false })
  password: string;

  @Column({
    default: Role.USER,
    enum: Role,
    type: 'enum',
  })
  roles: Role;

  @Column({ default: false })
  verifiedEmail: boolean;

  @Column({ default: '' })
  picture: string;

  @Column({ nullable: true, type: 'integer' })
  age: number;

  @Column({ nullable: true })
  @Exclude()
  currentRefreshToken: string;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @ManyToMany(() => BlogEntity)
  @JoinTable()
  allLikes: BlogEntity[];
}
