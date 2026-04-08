import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SUPER_SECRET_KEY_FOR_ASSESSMENT', // Must match your AuthModule secret
    });
  }

  async validate(payload: any) {
    // This return value is what gets attached to req.user
    return { sub: payload.sub, email: payload.email, role: payload.role };
  }
}
