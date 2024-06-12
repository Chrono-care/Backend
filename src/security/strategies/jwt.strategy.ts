import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: {
    id: string;
    email: string;
  }): Promise<{ userId: string; email: string }> {
    if (!payload) {
      Logger.error('No payload', 'JwtStrategy (validate)');
      throw new UnauthorizedException();
    }
    return { userId: payload.id, email: payload.email };
  }
}
