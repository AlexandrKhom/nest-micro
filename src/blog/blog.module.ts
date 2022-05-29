import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../user/entities/user.entity';
import { BlogController } from './blog.controller';
import { BlogRepository } from './blog.repository';
import { BlogService } from './blog.service';
import { BlogEntity } from './entities/blog.entity';

@Module({
  controllers: [BlogController],
  imports: [TypeOrmModule.forFeature([BlogEntity, UserEntity]), AuthModule],
  providers: [BlogService, BlogRepository],
})
export class BlogModule {}
