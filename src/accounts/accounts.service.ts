import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private AccountsRepository: Repository<Account>,
  ) {}

  async createAccount(newAccount: CreateAccountDto): Promise<Account> {
    try {
      const createdAccount = this.AccountsRepository.create(newAccount);
      const savedAccount = await this.AccountsRepository.save(createdAccount);
      return savedAccount;
    } catch (error) {
      console.debug(error.message);
      throw new BadRequestException(
        `L'adresse email ${newAccount.email} existe déjà.`,
      );
    }
  }

  async getAllAccounts(): Promise<Account[]> {
    const Accounts = await this.AccountsRepository.find();
    if (Accounts === null) {
      throw new NotFoundException(`Aucun utilisateur trouvé.`);
    }
    return Accounts;
  }

  async getAccountById(uuid: string): Promise<Account> {
    const Account = await this.AccountsRepository.findOne({
      where: { uuid },
    });
    if (Account === null) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    return Account;
  }

  async getAccountByEmail(email: string): Promise<Account> {
    const Account = await this.AccountsRepository.findOne({
      where: { email },
    });
    if (!Account) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'email ${email} n'a été trouvé.`,
      );
    }
    return Account;
  }

  async updateAccount(
    uuid: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const result = await this.AccountsRepository.update(uuid, updateAccountDto);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    const updatedAccount: Account = (await this.AccountsRepository.findOne({
      where: { uuid },
    }))!;
    return updatedAccount;
  }

  async deleteAccount(uuid: string): Promise<DeleteResult> {
    const result = await this.AccountsRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    return result;
  }
}
