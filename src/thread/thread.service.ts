import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateThreadDto } from './dto/create-thread.dto';
import { Thread } from './entities/thread.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Forum } from 'src/forums/entities/forum.entity';
import { PaginatedResource } from 'src/common/dto/paginated-resource.dto';
import { IPagination } from 'src/common/decorators/paginationParams.decorator';
import { ISorting } from 'src/common/decorators/sortingParams.decorator';
import { IFiltering } from 'src/common/decorators/filteringParams.decorator';
import { getOrder, getWhere } from 'src/common/helpers/orderORM.helper';
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

  async getAllTreads(
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

  async createTread(createThreadDto: CreateThreadDto): Promise<Thread> {
    const { title, content, imageUrl, authorId, forumId } = createThreadDto;

    const author = await this.accountRepository.findOne({
      where: { uuid: authorId },
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

  async archiveTread(id: number, set: boolean): Promise<Thread> {
    const thread = await this.threadRepository.findOneBy({ id });
    if (!thread) {
      throw new NotFoundException(`Le forum ${id} n'existe pas.`);
    }
    return await this.threadRepository.save({ ...thread, is_archived: set });
  }
}
