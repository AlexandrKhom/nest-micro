import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';

import { UserEntity } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { UserDec } from './decorators/user.decorator';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { GoogleAuthGuard } from './guards/google.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  //use COOKIES
  //***************
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginCookies(
    @UserDec() user: UserEntity,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.id);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithRefreshToken(user.id);

    await this.authService.setCurrentRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@UserDec() user: UserEntity, @Res({ passthrough: true }) res) {
    const { accessOption, refreshOption } =
      this.authService.getCookiesForLogOut();

    await this.authService.removeRefreshToken(user.id);

    res.cookie('Authentication', '', accessOption);
    res.cookie('Refresh', '', refreshOption);
    return user;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@UserDec() user: UserEntity, @Res({ passthrough: true }) res) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.id);
    res.cookie('Authentication', accessToken, accessOption);
    return user;
  }
  //***************

  //use Res
  //***************
  // @UseGuards(LocalAuthGuard)
  // @Post('signin')
  // async signin(@UserDec() user: UserEntity, @Res({ passthrough: true }) res) {
  //   const { accessToken } = this.authService.getCookieWithJwtAccessToken(
  //     user.id,
  //   );
  //   const { refreshToken } = this.authService.getCookieWithRefreshToken(
  //     user.id,
  //   );
  //   await this.authService.setCurrentRefreshToken(
  //     user.currentRefreshToken,
  //     user.id,
  //   );
  //
  //   return { accessToken, refreshToken };
  // }
  //***************

  @Post('signin')
  signIn(@Body() dto: LoginAuthDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(dto);
  }

  //Google
  @UseGuards(GoogleAuthGuard)
  @Get('google')
  async googleLogin() {
    return;
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(
    @UserDec() user: UserEntity,
    @Res({ passthrough: true }) res,
  ) {
    const { accessToken, ...accessOption } =
      this.authService.getCookieWithJwtAccessToken(user.id);

    const { refreshToken, ...refreshOption } =
      this.authService.getCookieWithRefreshToken(user.id);

    await this.authService.setCurrentRefreshToken(refreshToken, user.id);

    res.cookie('Authentication', accessToken, accessOption);
    res.cookie('Refresh', refreshToken, refreshOption);
    res.redirect('http://localhost:3000');
  }
}
