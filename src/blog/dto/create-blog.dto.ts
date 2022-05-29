import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBlogDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsArray()
  readonly tagList?: string[];

  @IsOptional()
  @IsString()
  readonly image?: string;
}
