import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class SecurityService {
  constructor(private jwtService: JwtService) {}

  async login(account: Account): Promise<{ access_token: string }> {
    const payload = { email: account.email, id: account.uuid };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
