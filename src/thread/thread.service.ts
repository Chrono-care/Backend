import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from './entities/thread.entity';
import { Account } from '../accounts/entities/account.entity';
import { Forum } from '../forums/entities/forum.entity';
import { PaginatedResource } from '../common/dto/paginated-resource.dto';
import { IPagination } from '../common/decorators/paginationParams.decorator';
import { ISorting } from '../common/decorators/sortingParams.decorator';
import { IFiltering } from '../common/decorators/filteringParams.decorator';
import { getOrder, getWhere } from '../common/helpers/orderORM.helper';
import { UpdateThreadDto } from './dto/update-thread.dto';
@Injectable()
export class ThreadService {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(Forum)
    private readonly forumRepository: Repository<Forum>,
  ) {}

  async getAllThreads(
    { page, limit, size, offset }: IPagination,
    sort?: ISorting,
    filter?: IFiltering[],
  ): Promise<PaginatedResource<Partial<Thread>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);
    const [threads, total] = await this.threadRepository.findAndCount({
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
      items: threads,
      page,
      size,
    };
  }

  async updateThread(
    id: number,
    uuid: string,
    updateThread: UpdateThreadDto,
  ): Promise<Thread> {
    const thread = await this.threadRepository.findOneBy({ id });

    const { title, content, imageUrl, forumId } = updateThread;

    if (!thread) throw new NotFoundException(`Le thread ${id} n'existe pas.`);

    const author = await this.accountRepository.findOne({
      where: { uuid },
    });
    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
    });

    if (!author || !forum)
      throw new NotFoundException('Author or Forum not found');

    return await this.threadRepository.save({
      ...thread,
      title,
      content,
      imageUrl,
      author,
      forum,
    });
  }

  async createThread(
    uuid: string,
    createThreadDto: CreateThreadDto,
  ): Promise<Thread> {
    const { title, content, imageUrl, forumId } = createThreadDto;

    const author = await this.accountRepository.findOne({
      where: { uuid },
    });
    const forum = await this.forumRepository.findOne({
      where: { id: forumId },
    });

    if (!author || !forum)
      throw new NotFoundException('Author or Forum not found');

    const thread = this.threadRepository.create({
      title,
      content,
      imageUrl,
      author,
      forum,
    });

    return this.threadRepository.save(thread);
  }

  async archiveThread(id: number, set: boolean): Promise<Thread> {
    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Le forum ${id} n'existe pas.`);
    }
    return await this.threadRepository.save({ ...thread, is_archived: set });
  }
}
