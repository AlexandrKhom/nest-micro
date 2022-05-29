import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { IJwtPayload } from '../types/i-jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      ignoreExpiration: true,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IJwtPayload): Promise<IJwtPayload> {
    console.log('jwt', payload);

    if (!payload) {
      throw new UnauthorizedException();
    }
    return this.userService.getUserById(payload.id);
  }
}
