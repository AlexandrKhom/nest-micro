import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository,Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { FilterBlogsDto } from './dto/filter-blog.dto';
import { BlogEntity } from './entities/blog.entity';
import { IQueryResponse } from './types/i-query-response';

@Injectable()
export class BlogRepository {
  constructor(
    @InjectRepository(BlogEntity)
    private readonly blogEnt: Repository<BlogEntity>,
    @InjectRepository(UserEntity)
    private readonly userEnt: Repository<UserEntity>,
  ) {}

  async createBlog(newBlog) {
    await this.blogEnt.save(newBlog);
    return newBlog;
  }

  async findAllBlogs(
    currentId: number,
    filterDto: FilterBlogsDto,
  ): Promise<IQueryResponse> {
    const { limit, offset, tag, search, author, allLikes } = filterDto;
    const queryBuilder = getRepository(BlogEntity)
      .createQueryBuilder('blogs')
      .leftJoinAndSelect('blogs.author', 'author');

    queryBuilder.orderBy('blogs.createdAt', 'DESC');
    const blogsCount = await queryBuilder.getCount();

    if (limit) {
      queryBuilder.limit(limit);
    }
    if (offset) {
      queryBuilder.offset(offset);
    }

    if (search) {
      queryBuilder.andWhere(
        '(LOWER(blogs.title) LIKE LOWER(:search) ' +
          'OR LOWER(blogs.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (tag) {
      queryBuilder.andWhere('blogs.tagList LIKE :tag', {
        tag: `%${tag}%`,
      });
    }

    if (author) {
      const author = await this.userEnt.findOne({ id: filterDto.author });
      queryBuilder.andWhere('blogs.author = :id', {
        id: author.id,
      });
    }

    if (allLikes) {
      const author = await this.userEnt.findOne(
        { id: filterDto.allLikes },
        { relations: ['allLikes'] },
      );
      const ids = author.allLikes.map((el) => el.id);
      if (ids.length > 0) {
        queryBuilder.andWhere('blogs.id in (:...ids)', { ids });
      } else {
        queryBuilder.andWhere('1 = 0');
      }
    }

    let likesIds: number[] = [];
    if (currentId) {
      const currentUser = await this.userEnt.findOne(currentId, {
        relations: ['allLikes'],
      });
      likesIds = currentUser.allLikes.map((el) => el.id);
    }

    const blogs = await queryBuilder.getMany();

    const blogWithLikes = blogs.map((el) => {
      const liked = likesIds.includes(el.id);
      return { ...el, liked };
    });
    return { blogs: blogWithLikes, blogsCount };
  }

  async getBySlug(slug: string): Promise<BlogEntity> {
    const found = await this.blogEnt.findOne({ slug });
    if (!found) throw new NotFoundException(`slug ${slug} not found`);
    return found;
  }

  async removeBySlag(auth: UserEntity, slug: string): Promise<DeleteResult> {
    const found = await this.getBySlug(slug);
    if (found.author.id !== auth.id) {
      throw new HttpException('not author of this', HttpStatus.FORBIDDEN);
    }
    return this.blogEnt.delete({ slug });
  }

  async addLike(slug: string, currentId: number): Promise<BlogEntity> {
    const blog = await this.getBySlug(slug);
    const user = await this.userEnt.findOne(currentId, {
      relations: ['allLikes'],
    });

    const isNotLike = user.allLikes.findIndex((el) => el.id === blog.id) === -1;

    if (isNotLike) {
      user.allLikes.push(blog);
      blog.likes++;
      await this.userEnt.save(user);
      await this.blogEnt.save(blog);
    }

    return blog;
  }

  async disLike(slug: string, currentId: number): Promise<BlogEntity> {
    const blog = await this.getBySlug(slug);
    const user = await this.userEnt.findOne(currentId, {
      relations: ['allLikes'],
    });

    const blogIndex = user.allLikes.findIndex((el) => el.id === blog.id);
    console.log(blogIndex);

    if (blogIndex >= 0) {
      user.allLikes.splice(blogIndex, 1);
      blog.likes--;
      await this.userEnt.save(user);
      await this.blogEnt.save(blog);
    }

    return blog;
  }
}
