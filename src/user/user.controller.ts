import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';
import { UserDec } from '../auth/decorators/user.decorator';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createUser(
    @Body() dto: CreateUserDto,
    @UserDec() user: UserEntity,
  ): Promise<UserEntity> {
    return this.userService.createUser(dto, user);
  }

  @Get()
  getUsers(@Query() dto: FilterUserDto): Promise<UserEntity[]> {
    return this.userService.getUsers(dto);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.getUserById(+id);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(dto, id);
  }

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<void> {
    return this.userService.deleteById(+id);
  }
}
