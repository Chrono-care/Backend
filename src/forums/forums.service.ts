import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPagination } from 'src/common/decorators/paginationParams.decorator';
import { ISorting } from 'src/common/decorators/sortingParams.decorator';
import { IFiltering } from 'src/common/decorators/filteringParams.decorator';
import { PaginatedResource } from 'src/common/dto/paginated-resource.dto';
import { Forum } from './entities/forum.entity';
import { getOrder, getWhere } from 'src/common/helpers/orderORM.helper';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';

@Injectable()
export class ForumsService {
  constructor(
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
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
}
