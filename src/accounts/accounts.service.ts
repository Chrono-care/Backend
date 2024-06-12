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
import { Pagination } from './decorators/paginationParams.decorator';
import { Sorting } from './decorators/sortingParams.decorator';
import { Filtering } from './decorators/filteringParams.decorator';
import { PaginatedResource } from './dto/paginated-resource.dto';
import { getOrder, getWhere } from './helpers/orderORM.helper';

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

  async getAllAccounts(
      { page, limit, size, offset }: Pagination,
      sort?: Sorting,
      filter?: Filtering,
  ): Promise<PaginatedResource<Partial<Account>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);
    const [accounts, total] = await this.AccountsRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
    if (total === 0) {
      throw new NotFoundException(`Aucun utilisateur trouvé.`);
    }
    return {
      totalItems: total,
      items: accounts,
      page,
      size,
    }
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
    const updatedAccount: Account = await this.AccountsRepository.findOne({
      where: { uuid },
    });
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
