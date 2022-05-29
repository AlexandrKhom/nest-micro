import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('REFRESH_TOKEN_SECRET'),
    });
  }

  async validate(req: Request, payload) {
    const refreshToken = req.cookies?.Refresh;
    console.log(refreshToken);

    if (!refreshToken)
      throw new ForbiddenException('Refresh token malformed!!!');

    return this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.id,
    );
  }
}
