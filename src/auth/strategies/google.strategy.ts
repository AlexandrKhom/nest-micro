import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'dotenv';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/user.service';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {
    super({
      callbackURL: 'http://localhost:3000/auth/google/callback',
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const { name, emails, photos } = profile;
    console.log('googleProf', profile);
    const { value: email, verified } = emails[0];
    const user = await this.userService.findUser({ email });
    if (user) {
      return done(null, user);
    } else {
      const newUser = new UserEntity();
      newUser.email = email;
      newUser.username = name.familyName + ' ' + name.givenName;
      newUser.verifiedEmail = verified;
      newUser.picture = photos[0].value;
      accessToken;
      refreshToken;
      await this.userService.saveUser(newUser);
      return done(null, newUser);
    }
  }
}
