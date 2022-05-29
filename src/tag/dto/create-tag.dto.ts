import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2, { message: 'wrong min length' })
  readonly name: string;
}
