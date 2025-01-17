import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagination } from '../common/decorators/paginationParams.decorator';
import { ISorting } from '../common/decorators/sortingParams.decorator';
import { IFiltering } from '../common/decorators/filteringParams.decorator';
import { PaginatedResource } from '../common/dto/paginated-resource.dto';
import { Forum } from './entities/forum.entity';
import { getOrder, getWhere } from '../common/helpers/orderORM.helper';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { Subscribe } from './entities/subscribe.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private readonly forumsRepository: Repository<Forum>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async getAllForums(
    { page, limit, size, offset }: IPagination,
    sort?: ISorting,
    filter?: IFiltering[],
  ): Promise<PaginatedResource<Partial<Forum>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);
    const [accounts, total] = await this.forumsRepository.findAndCount({
      where,
      order,
      take: limit,
      skip: offset,
    });
    if (total === 0) {
      throw new NotFoundException(`Aucun forum trouvé.`);
    }
    return {
      totalItems: total,
      items: accounts,
      page,
      size,
    };
  }

  async createForum(newForum: CreateForumDto): Promise<Forum> {
    try {
      const createdForum = this.forumsRepository.create(newForum);
      return await this.forumsRepository.save(createdForum);
    } catch (error) {
      console.debug(error.message);
      throw new BadRequestException(`Le forum ${newForum.title} existe déjà.`);
    }
  }

  async updateForum(id: number, updateForum: UpdateForumDto): Promise<Forum> {
    const forum = await this.forumsRepository.findOneBy({ id });
    if (!forum) {
      throw new NotFoundException(`Le forum ${id} n'existe pas.`);
    }
    return await this.forumsRepository.save({ ...forum, ...updateForum });
  }

  async archiveForum(id: number, set: boolean): Promise<Forum> {
    const forum = await this.forumsRepository.findOneBy({ id });
    if (!forum) {
      throw new NotFoundException(`Le forum ${id} n'existe pas.`);
    }
    return await this.forumsRepository.save({ ...forum, is_archived: set });
  }

  async deleteForum(id: number): Promise<Forum> {
    const forum = await this.forumsRepository.findOneBy({ id });
    if (!forum) {
      throw new NotFoundException(`Le forum ${id} n'existe pas.`);
    }
    await this.forumsRepository.delete({ id });
    return forum;
  }

  async getSubscribers(forumId: number): Promise<Subscribe[]> {
    const forum = await this.forumsRepository.findOneBy({ id: forumId });
    if (!forum) {
      throw new NotFoundException(`Le forum ${forumId} n'existe pas.`);
    }
    return await this.forumsRepository
      .createQueryBuilder()
      .relation(Forum, 'subscribers')
      .of(forum)
      .loadMany();
  }

  async addSubscriber(forumId: number, accountId: string): Promise<Subscribe> {
    const forum = await this.forumsRepository.findOneBy({ id: forumId });
    if (!forum) {
      throw new NotFoundException(`Le forum ${forumId} n'existe pas.`);
    }
    const account = await this.accountsRepository.findOneBy({
      uuid: accountId,
    });
    if (!account) {
      throw new NotFoundException(`L'utilisateur ${accountId} n'existe pas.`);
    }
    const subscribe = new Subscribe();
    subscribe.account = account;
    subscribe.forum = forum;
    await this.forumsRepository
      .createQueryBuilder()
      .relation(Forum, 'subscribers')
      .of(forum)
      .add(subscribe);
    return subscribe;
  }

  async removeSubscriber(forumId: number, accountId: string): Promise<void> {
    const forum = await this.forumsRepository.findOneBy({ id: forumId });
    if (!forum) {
      throw new NotFoundException(`Le forum ${forumId} n'existe pas.`);
    }
    const account = await this.accountsRepository.findOneBy({
      uuid: accountId,
    });
    if (!account) {
      throw new NotFoundException(`L'utilisateur ${accountId} n'existe pas.`);
    }
    await this.forumsRepository
      .createQueryBuilder()
      .relation(Forum, 'subscribers')
      .of(forum)
      .remove(account);
  }
}
