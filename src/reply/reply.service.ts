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

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,
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

  async createReply(newReply: CreateReplyDto): Promise<Reply> {
    try {
      const createdReply = this.replyRepository.create(newReply);
      return await this.replyRepository.save(createdReply);
    } catch (error) {
      console.debug(error.message);
      throw new BadRequestException(
        `Une erreur s'est produite lors de la création de la réponse`,
      );
    }
  }
}
