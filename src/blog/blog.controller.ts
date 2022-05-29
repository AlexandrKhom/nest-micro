import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { UserDec } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserEntity } from '../user/entities/user.entity';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { FilterBlogsDto } from './dto/filter-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogEntity } from './entities/blog.entity';
import { IQueryResponse } from './types/i-query-response';

@Controller('blog')
@UseGuards(JwtAuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  createBlog(
    @UserDec() user: UserEntity,
    @Body() dto: CreateBlogDto,
  ): Promise<BlogEntity> {
    return this.blogService.createBlog(dto, user);
  }

  @Get()
  findAllBlogs(
    @UserDec('id') currId: number,
    @Query() filterDto: FilterBlogsDto,
  ): Promise<IQueryResponse> {
    return this.blogService.findAllBlogs(currId, filterDto);
  }

  @Get(':slug')
  getBySlug(@Param('slug') slug: string): Promise<BlogEntity> {
    return this.blogService.getBySlug(slug);
  }

  @Patch(':slug')
  updateBySlag(
    @UserDec('id') user: UserEntity,
    @Param('slug') slug: string,
    @Body() dto: UpdateBlogDto,
  ) {
    return this.blogService.updateBySlag(user, slug, dto);
  }

  @Delete(':slug')
  removeBySlag(
    @UserDec('id') user: UserEntity,
    @Param('slug') slug: string,
  ): Promise<DeleteResult> {
    return this.blogService.removeBySlag(user, slug);
  }

  @Post(':slug/likes')
  @UseGuards(JwtAuthGuard)
  async addLikes(
    @UserDec('id') currentId: number,
    @Param('slug') slug: string,
  ) {
    return this.blogService.addLikes(slug, currentId);
  }

  @Delete(':slug/likes')
  @UseGuards(JwtAuthGuard)
  async disLike(@UserDec('id') currentId: number, @Param('slug') slug: string) {
    return this.blogService.disLikes(slug, currentId);
  }
}
