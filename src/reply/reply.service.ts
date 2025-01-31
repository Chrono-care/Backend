import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reply } from './entities/reply.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagination } from 'src/common/decorators/paginationParams.decorator';
import { ISorting } from 'src/common/decorators/sortingParams.decorator';
import { IFiltering } from 'src/common/decorators/filteringParams.decorator';
import { PaginatedResource } from 'src/common/dto/paginated-resource.dto';
import { getOrder, getWhere } from 'src/common/helpers/orderORM.helper';
import { CreateReplyDto } from './dto/create-reply.dto';
import { Thread } from 'src/thread/entities/thread.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async getAllReplies(
    { page, limit, size, offset }: IPagination,
    sort?: ISorting,
    filter?: IFiltering[],
  ): Promise<PaginatedResource<Partial<Reply>>> {
    const where = getWhere(filter);
    const order = getOrder(sort);
    const [accounts, total] = await this.replyRepository.findAndCount({
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

  async getReplyById(id: number): Promise<Reply> {
    return this.replyRepository.findOne({ where: { id } });
  }

  async createForThread(
    accountId: string,
    newReply: CreateReplyDto,
    threadId: number,
  ): Promise<Reply> {
    const thread = await this.threadRepository.findOne({
      where: { id: threadId },
    });
    const account = await this.accountRepository.findOne({
      where: { uuid: accountId },
    });
    if (!thread) {
      throw new BadRequestException(
        `Le file de discussion ${threadId} n'existe pas.`,
      );
    }
    if (!account) {
      throw new BadRequestException(`L'utilisateur ${accountId} n'existe pas.`);
    }
    const reply = this.replyRepository.create({
      ...newReply,
      author: account,
      thread: thread,
    });
    return this.replyRepository.save(reply);
  }

  async createForReply(
    accountId: string,
    newReply: CreateReplyDto,
    replyId: number,
  ): Promise<Reply> {
    const responseToReply = await this.replyRepository.findOne({
      where: { id: replyId },
      relations: ['thread'],
    });
    if (!responseToReply) {
      throw new BadRequestException(`La réponse ${replyId} n'existe pas.`);
    }
    const thread = await this.threadRepository.findOne({
      where: { id: responseToReply.thread.id },
    });
    if (!thread) {
      throw new BadRequestException(
        `Le fil de discussion ${responseToReply.thread.id} n'existe pas.`,
      );
    }
    const account = await this.accountRepository.findOne({
      where: { uuid: accountId },
    });
    if (!account) {
      throw new BadRequestException(`L'utilisateur ${accountId} n'existe pas.`);
    }
    const reply = this.replyRepository.create({
      ...newReply,
      thread: thread,
      author: account,
      responseTo: responseToReply,
    });
    return this.replyRepository.save(reply);
  }

  async updateReply(updatedReply: CreateReplyDto, id: number): Promise<Reply> {
    const reply = await this.replyRepository.findOne({ where: { id } });
    if (!reply) {
      throw new BadRequestException(`La réponse ${id} n'existe pas.`);
    }
    return this.replyRepository.save({ ...reply, ...updatedReply });
  }

  async deleteReply(id: number): Promise<void> {
    const reply = await this.replyRepository.findOne({ where: { id } });
    if (!reply) {
      throw new BadRequestException(`La réponse ${id} n'existe pas.`);
    }
    await this.replyRepository.delete({ id });
  }

  async archiveReply(id: number, set: boolean): Promise<Reply> {
    const reply = await this.replyRepository.findOne({ where: { id } });
    if (!reply) {
      throw new BadRequestException(`La réponse ${id} n'existe pas.`);
    }
    return this.replyRepository.save({ ...reply, is_archived: set });
  }
}
