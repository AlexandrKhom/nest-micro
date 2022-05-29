import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';

@EntityRepository(TagEntity)
export class TagRepository extends Repository<TagEntity> {
  async createTag(dto: CreateTagDto) {
    const { name } = dto;
    const newTag = this.create({ name });

    try {
      await this.save(newTag);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('tag already exist');
      } else {
        console.log(e.code, e.detail);
      }
    }
    return newTag;
  }

  async findAllTags() {
    return this.find();
  }

  async findOneTag(id: string) {
    try {
      return await this.findOne(id);
    } catch (e) {
      console.log(e);
      throw new NotFoundException(`Tag with ID "${id}" not found`);
    }
  }

  async removeTag(id: string) {
    const found = await this.findOneTag(id);
    if (!found) throw new NotFoundException(`alex id = ${id} not found`);
    await this.delete(found);
  }
}
