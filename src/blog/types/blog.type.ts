import { BlogEntity } from '../entities/blog.entity';

export type BlogType = Omit<BlogEntity, 'updateTimestamp'>;
