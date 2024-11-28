import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
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

const authorizedFields = ['id', 'title', 'content', 'is_archived'];
@Controller('thread')
export class ThreadController {
  constructor(private readonly threadService: ThreadService) {}
  @Get()
  async getAllThreads(
    @Res() response: Response,
    @PaginationParams({}) pagination: IPagination,
    @SortingParams(authorizedFields) sort?: ISorting,
    @FilteringParams(authorizedFields) filter?: IFiltering[],
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.threadService.getAllTreads(pagination, sort, filter));
  }

  @Post('/create')
  async create(
    @Res() response: Response,
    @Body(new ValidationPipe()) newThread: CreateThreadDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(await this.threadService.createTread(newThread));
  }

  @Patch('/archive/:id')
  async archive(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Query('set', new DefaultValuePipe(true), ParseBoolPipe) set: boolean,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.threadService.archiveTread(id, set));
  }
}
