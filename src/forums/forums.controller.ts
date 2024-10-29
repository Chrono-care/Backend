import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import {
  Pagination,
  PaginationParams,
} from 'src/common/decorators/paginationParams.decorator';
import {
  Sorting,
  SortingParams,
} from 'src/common/decorators/sortingParams.decorator';
import {
  Filtering,
  FilteringParams,
} from 'src/common/decorators/filteringParams.decorator';
import { Response } from 'express';
import { CreateForumDto } from './dto/create-forum.dto';
import { forumsService } from './forums.service';

const authorizedFields = ['id', 'title', 'description'];

@Controller('forums')
export class forumsController {
  constructor(private readonly forumsService: forumsService) {}

  @Get()
  async getAll(
    @Res() response: Response,
    @PaginationParams({}) pagination: Pagination,
    @SortingParams(authorizedFields) sort?: Sorting,
    @FilteringParams(authorizedFields) filter?: Filtering,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.getAllForums(pagination, sort, filter));
  }
}
