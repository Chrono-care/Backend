import { Request } from 'express';
import { Account } from 'src/accounts/entities/account.entity';

export interface IAuthenticatedRequest extends Request {
  account: {
    uuid: string;
    email: string;
  };
}

export interface ILoginRequest extends Request {
  account: Account;
}
