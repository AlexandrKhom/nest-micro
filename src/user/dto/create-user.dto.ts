import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNumber()
  @Min(18, { message: 'wrong min age' })
  @Max(100, { message: 'wrong max age' })
  @IsNotEmpty()
  readonly age: number;
}
