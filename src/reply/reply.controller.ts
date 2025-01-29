import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { ReplyService } from './reply.service';
import {
  IPagination,
  PaginationParams,
} from 'src/common/decorators/paginationParams.decorator';
import {
  ISorting,
  SortingParams,
} from 'src/common/decorators/sortingParams.decorator';
import {
  FilteringParams,
  IFiltering,
} from 'src/common/decorators/filteringParams.decorator';
import { Response } from 'express';

const authorizedFields = ['id', 'content', 'author', 'thread', 'responseTo'];

@Controller('reply')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Get()
  async getAll(
    @Res() response: Response,
    @PaginationParams({}) pagination: IPagination,
    @SortingParams(authorizedFields) sort?: ISorting,
    @FilteringParams(authorizedFields) filter?: IFiltering[],
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.replyService.getAllReplies(pagination, sort, filter));
  }
}
