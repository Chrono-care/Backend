import { Request } from 'express';
import { Account } from 'src/accounts/entities/account.entity';

export interface AuthenticatedRequest extends Request {
  account: {
    uuid: string;
    email: string;
  };
}

export interface LoginRequest extends Request {
  account: Account;
}
