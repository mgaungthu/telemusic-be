import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../services/user/user.service';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private users: UserService) {
    super({
     jwtFromRequest: ExtractJwt.fromExtractors([
        // 1️⃣ Cookie based
        (req: Request) => req?.cookies?.access_token,

        // 2️⃣ Authorization header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecretkey',
    });
  }

  async validate(payload: any) {
    // payload = { sub: userId, role: 'artist' | 'listener' | 'admin' }
    const userId = BigInt(payload.sub); // we stored it as string/number in token
    const user = await this.users.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    // This object becomes request.user
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}