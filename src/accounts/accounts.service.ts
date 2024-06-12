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
    private accountsRepository: Repository<Account>,
  ) {}

  /**
   * Create a new account.
   * @param newAccount - The account data to be created.
   * @returns The created account.
   * @throws BadRequestException if the email address already exists.
   */
  async createAccount(newAccount: CreateAccountDto): Promise<Account> {
    try {
      const createdAccount = this.accountsRepository.create(newAccount);
      return await this.accountsRepository.save(createdAccount);
    } catch (error) {
      console.debug(error.message);
      throw new BadRequestException(
        `L'adresse email ${newAccount.email} existe déjà.`,
      );
    }
  }

  /**
   * Get all accounts with pagination, sorting, and filtering options.
   * @param pagination - The pagination options.
   * @param sort - The sorting options.
   * @param filter - The filtering options.
   * @returns The paginated resource containing the accounts.
   * @throws NotFoundException if no accounts are found.
   */
  async getAllAccounts(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
  ): Promise<PaginatedResource<Partial<Account>>> {
    const where = getWhere(filter);
    console.log(typeof where);
    const order = getOrder(sort);
    const [accounts, total] = await this.accountsRepository.findAndCount({
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
    };
  }

  /**
   * Get an account by its UUID.
   * @param uuid - The UUID of the account.
   * @returns The account with the specified UUID.
   * @throws NotFoundException if no account is found with the specified UUID.
   */
  async getAccountById(uuid: string): Promise<Account> {
    const Account = await this.accountsRepository.findOne({
      where: { uuid },
    });
    if (Account === null) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    return Account;
  }

  /**
   * Update an account by its UUID.
   * @param uuid - The UUID of the account to be updated.
   * @param updateAccountDto - The updated account data.
   * @returns The updated account.
   * @throws NotFoundException if no account is found with the specified UUID.
   */
  async updateAccount(
    uuid: string,
    updateAccountDto: UpdateAccountDto,
  ): Promise<Account> {
    const result = await this.accountsRepository.update(uuid, updateAccountDto);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    const updatedAccount: Account = await this.accountsRepository.findOne({
      where: { uuid },
    });
    return updatedAccount;
  }

  /**
   * Delete an account by its UUID.
   * @param uuid - The UUID of the account to be deleted.
   * @returns The result of the delete operation.
   * @throws NotFoundException if no account is found with the specified UUID.
   */
  async deleteAccount(uuid: string): Promise<DeleteResult> {
    const result = await this.accountsRepository.delete(uuid);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Aucun utilisateur avec l'uuid ${uuid} n'a été trouvé.`,
      );
    }
    return result;
  }
}
