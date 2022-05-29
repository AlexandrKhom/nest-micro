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

export class RegisterUserDto
  implements Pick<UserType, 'password' | 'username' | 'email'>
{
  @ApiProperty({ description: 'nicName - should be unique', example: 'alex' })
  @MinLength(2)
  @MaxLength(22)
  @IsOptional()
  username: string;

  @ApiProperty({ description: 'user password', example: 'sdQd3gD' })
  @IsNotEmpty()
  @Length(5, 15)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @ApiProperty({ description: 'user password', example: 'sdQd3gD' })
  @IsNotEmpty()
  @Length(5, 15)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  repeatpassword: string;

  @ApiProperty({ description: 'user email', example: 'pol@mail.de' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
