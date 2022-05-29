import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  //for LocalStrategy
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new HttpException('not valid data', HttpStatus.BAD_REQUEST);
    }
  }

  register(dto: RegisterUserDto) {
    return this.userService.register(dto);
  }

  getCookieWithJwtAccessToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
    });

    return {
      accessToken: token,
      domain: 'localhost',
      httpOnly: true,
      maxAge:
        parseInt(this.configService.get('ACCESS_TOKEN_EXPIRATION')) * 1000,
      path: '/',
    };
  }

  getCookieWithRefreshToken(id: number) {
    const payload = { id };
    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION'),
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
    });

    return {
      domain: 'localhost',
      httpOnly: true,
      maxAge:
        parseInt(this.configService.get('REFRESH_TOKEN_EXPIRATION')) * 1000,
      path: '/',
      refreshToken: token,
    };
  }

  getCookiesForLogOut() {
    return {
      accessOption: {
        domain: 'localhost',
        httpOnly: true,
        maxAge: 0,
        path: '/',
      },

      refreshOption: {
        domain: 'localhost',
        httpOnly: true,
        maxAge: 0,
        path: '/',
      },
    };
  }

  //userServ
  async setCurrentRefreshToken(refreshToken: string, id: number) {
    return this.userService.setCurrentRefreshToken(refreshToken, id);
  }

  async removeRefreshToken(id: number) {
    return this.userService.removeRefreshToken(id);
  }

  async signIn(dto: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = dto;
    const user = await this.userService.findByEmail(email);
    const { roles, id } = user;

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('check login credentials!!!');
    }
  }
}
