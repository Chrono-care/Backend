import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Account } from '../../accounts/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {
    Logger.log('LocalStrategy constructor', 'LocalStrategy');
    super({ usernameField: 'email' });
  }

  async validate(username: string, password: string): Promise<Account> {
    const email = username.toLowerCase();
    Logger.log('Validating ' + email, 'LocalStrategy', 'validate');
    const account: Account | null = await this.accountsRepository.findOne({
      where: { email: email },
    });
    if (!account) {
      Logger.error('Email not found for ' + email, 'LocalStrategy', 'validate');
      throw new UnauthorizedException('Email or password invalid');
    }
    const isValid = await account.comparePassword(password);
    if (!isValid) {
      Logger.error('Wrong password for ' + email, 'LocalStrategy (validate)');
      throw new UnauthorizedException('Email or password invalid');
    }
    return account;
  }
}
