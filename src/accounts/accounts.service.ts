import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { IPagination } from '../common/decorators/paginationParams.decorator';
import { ISorting } from '../common/decorators/sortingParams.decorator';
import { IFiltering } from '../common/decorators/filteringParams.decorator';
import { PaginatedResource } from '../common/dto/paginated-resource.dto';
import { getOrder, getWhere } from '../common/helpers/orderORM.helper';
import { Forum } from 'src/forums/entities/forum.entity';
import { MailsService } from '../mails/mails.service';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @Inject(MailsService)
    private mailsService: MailsService,
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
      await this.mailsService.sendValidationEmail(createdAccount);
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
    { page, limit, size, offset }: IPagination,
    sort?: ISorting,
    filter?: IFiltering[],
  ): Promise<PaginatedResource<Partial<Account>>> {
    const where = getWhere(filter);
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

  async getSubscribedForums(uuid: string): Promise<Forum[]> {
    const account = await this.accountsRepository.findOne({
      where: { uuid },
      relations: ['subscribes', 'subscribes.forum'],
    });
    if (!account) {
      throw new NotFoundException(`L'utilisateur ${uuid} n'existe pas.`);
    }
    return account.subscribes.map((subscribe) => subscribe.forum);
  }
  async validateEmail(uuid: string): Promise<void> {
    const user = await this.accountsRepository.findOne({ where: { uuid } });
    Logger.log(uuid);
    if (!user)
      throw new NotFoundException("Ce calineur de maman n'existe pas.");
    user.validated = true;
    Logger.log(
      `User ${user.firstname} ${user.lastname} validated : ${user.validated}.`,
    );
    try {
      Logger.log(user);
      await this.accountsRepository.update(uuid, user);
    } catch (err) {
      Logger.error('mailModule', err);
      throw new InternalServerErrorException(err);
    }
  }
}
