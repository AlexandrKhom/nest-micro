import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TagRepository } from './tag.repository';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagRepository) private readonly tagRepo: TagRepository,
  ) {}

  createTag(dto: CreateTagDto) {
    return this.tagRepo.createTag(dto);
  }

  findAllTags() {
    return this.tagRepo.findAllTags();
  }

  findOneTag(id: string) {
    return this.tagRepo.findOneTag(id);
  }

  removeTag(id: string) {
    return this.tagRepo.removeTag(id);
  }
}
