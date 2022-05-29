import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

import { UserType } from '../../user/types/user.type';

export class LoginAuthDto implements Pick<UserType, 'password' | 'email'> {
  @ApiProperty({ description: 'nicName - should not unique', example: 'alex' })
  @Length(3, 15)
  @IsOptional()
  userName: string;

  @ApiProperty({ description: 'user password', example: '123QWe' })
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(16)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @ApiProperty({ description: 'user unique email', example: 'alex@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
