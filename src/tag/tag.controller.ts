import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { RolesDec } from '../auth/decorators/roles.decorator';
import { UserDec } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtBearerGuard } from '../auth/guards/jwt-bearer.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role, UserEntity } from '../user/entities/user.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagEntity } from './entities/tag.entity';
import { TagService } from './tag.service';

@Controller('tag')
export class TagController {
  private logger = new Logger('TagController');
  constructor(private readonly tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createTag(@Body() dto: CreateTagDto): Promise<TagEntity> {
    return this.tagService.createTag(dto);
  }

  @UseGuards(JwtBearerGuard, RolesGuard)
  @RolesDec(Role.USER)
  @Get()
  findAllTags(@UserDec() user: UserEntity): Promise<TagEntity[]> {
    this.logger.verbose(`User "${user.username}" retrieving all tags.`);
    console.log('getAll', user);
    return this.tagService.findAllTags();
  }

  @Get(':id')
  findOneTag(@Param('id') id: string): Promise<TagEntity> {
    return this.tagService.findOneTag(id);
  }

  @Delete(':id')
  removeTag(@Param('id') id: string): Promise<void> {
    return this.tagService.removeTag(id);
  }
}
