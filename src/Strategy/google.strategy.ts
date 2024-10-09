import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_API,
      clientSecret: process.env.GOOGLE_API_SECRET,
      callbackURL: process.env.BASE_URI + '/api/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, displayName } = profile;
    // //console.log(profile);
    const user = {
      username: displayName,
      email: emails[0].value,
      firstname: name.givenName,
      lastname: name.familyName,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
