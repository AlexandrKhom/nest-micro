import { TagEntity } from '../entities/tag.entity';

export type TagType = Omit<TagEntity, 'id'>;
