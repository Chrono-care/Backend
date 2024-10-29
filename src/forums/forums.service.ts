import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/common/decorators/paginationParams.decorator';
import { Sorting } from 'src/common/decorators/sortingParams.decorator';
import { Filtering } from 'src/common/decorators/filteringParams.decorator';
import { PaginatedResource } from 'src/common/dto/paginated-resource.dto';
import { Forum } from './entities/forum.entity';
import { getOrder, getWhere } from 'src/common/helpers/orderORM.helper';

@Injectable()
export class forumsService {
  constructor(
    @InjectRepository(Forum)
    private forumsRepository: Repository<Forum>,
  ) {}

  async getAllForums(
    { page, limit, size, offset }: Pagination,
    sort?: Sorting,
    filter?: Filtering,
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
}
