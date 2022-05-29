import { BlogType } from './blog.type';

export interface IQueryResponse {
  blogs: BlogType[];
  blogsCount: number;
}
