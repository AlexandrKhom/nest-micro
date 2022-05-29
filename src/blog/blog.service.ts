import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import slugify from 'slugify';
import { DeleteResult } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { BlogRepository } from './blog.repository';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FilterBlogsDto } from './dto/filter-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogEntity } from './entities/blog.entity';
import { IQueryResponse } from './types/i-query-response';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepo: BlogRepository) {}
  createBlog(dto: CreateBlogDto, user: UserEntity) {
    const newBlog = new BlogEntity();
    Object.assign(newBlog, dto);

    if (!newBlog.tagList) {
      newBlog.tagList = [];
    }
    newBlog.slug = this.createSlug(dto.title);
    newBlog.author = user;

    return this.blogRepo.createBlog(newBlog);
  }

  private createSlug(title: string): string {
    const some = crypto.randomBytes(8).toString('hex');
    // const diff = Math.round(Math.random() * 1e15).toString(36);
    return slugify(title, { lower: true }) + '-' + some;
  }

  findAllBlogs(
    currId: number,
    filterDto: FilterBlogsDto,
  ): Promise<IQueryResponse> {
    return this.blogRepo.findAllBlogs(currId, filterDto);
  }

  getBySlug(slug: string): Promise<BlogEntity> {
    return this.blogRepo.getBySlug(slug);
  }

  async updateBySlag(user: UserEntity, slug: string, dto: UpdateBlogDto) {
    const blog = await this.getBySlug(slug);
    if (!blog) {
      throw new HttpException('not blog alex', HttpStatus.NOT_FOUND);
    }
    if (blog.author.id !== user.id) {
      throw new HttpException('not user alex', HttpStatus.FORBIDDEN);
    }

    if (!blog.tagList) {
      blog.tagList = [];
    }
    Object.assign(blog, dto);

    blog.slug = this.createSlug(dto.title);

    return this.blogRepo.createBlog(blog);
  }

  removeBySlag(user: UserEntity, slug: string): Promise<DeleteResult> {
    return this.blogRepo.removeBySlag(user, slug);
  }

  async addLikes(slug: string, currentId: number): Promise<BlogEntity> {
    return this.blogRepo.addLike(slug, currentId);
  }

  async disLikes(slug: string, currentId: number): Promise<BlogEntity> {
    return this.blogRepo.disLike(slug, currentId);
  }
}
