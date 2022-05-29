import {
  ConflictException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository, getRepository } from 'typeorm';

import { AuthService } from '../auth/auth.service';
import { LoginAuthDto } from '../auth/dto/login-auth.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role, UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  //Register User
  async register(dto: RegisterUserDto): Promise<UserEntity> {
    const { email, password, repeatpassword, username } = dto;

    if (password !== repeatpassword)
      throw new UnprocessableEntityException({
        message: 'not correct double password',
        registerSuccess: false,
      });

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      roles: Role.USER,
      username,
    });
    console.log('user', user);

    try {
      await this.userRepo.save(user);
      delete user.password;
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('user already exist');
      } else {
        console.log(e.code, e.detail);
        return e;
      }
    }
  }

  async findByEmail(email: string): Promise<UserEntity | undefined> {
    const found = await this.userRepo.findOne(
      { email },
      {
        select: [
          'id',
          'email',
          'username',
          'email',
          'password',
          'roles',
          'picture',
          'verifiedEmail',
          'currentRefreshToken',
        ],
      },
    );
    if (!found) throw new NotFoundException(`email = ${email} not found!!!`);
    return found;
  }

  //JWT strategy
  async getUserById(id: number) {
    const user = await this.userRepo.findOne({ id });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }

  //Refresh Strategy
  async getUserIfRefreshTokenMatches(refreshToken: string, id: number) {
    const user = await this.getUserById(id);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  //Auth logout
  async removeRefreshToken(id: number) {
    return this.userRepo.update(id, {
      currentRefreshToken: null,
    });
  }

  //hash refreshToken to currentRefreshToken
  async setCurrentRefreshToken(refreshToken: string, id: number) {
    const salts = await bcrypt.genSalt();
    const currentRefreshToken = await bcrypt.hash(refreshToken, salts);
    await this.userRepo.update(id, { currentRefreshToken });
  }

  //for Google auth
  async saveUser(user) {
    return this.userRepo.save(user);
  }

  async findUser(findUserObj) {
    return this.userRepo.findOne(findUserObj);
  }

  //User Service
  async createUser(dto: CreateUserDto, user: UserEntity) {
    const newUser = await this.findUser(user.id);
    Object.assign(newUser, dto);
    return this.userRepo.save(newUser);
  }

  async getUsers(filterDto: FilterUserDto): Promise<UserEntity[]> {
    const { search } = filterDto;
    const query = this.userRepo.createQueryBuilder('user');

    if (search) {
      query.andWhere('LOWER(user.name) LIKE LOWER(:search)', {
        search: `%${search}%`,
      });
    }

    const users = await query.getMany();
    return users;
  }

  // async getUserById(id: number) {
  //   const found = await this.userRepo.findOne({ id });
  //   if (!found) throw new NotFoundException(`id = ${id} not found`);
  //   return found;
  // }

  async updateUser(dto: UpdateUserDto, id: number): Promise<UserEntity> {
    const user = await this.getUserById(id);
    Object.assign(user, dto);
    return this.userRepo.save(user);
  }

  async deleteById(id: number) {
    const found = await this.getUserById(id);
    await this.userRepo.delete(found);
  }
}
