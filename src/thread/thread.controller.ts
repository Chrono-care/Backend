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
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ThreadService } from './thread.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import {
  IPagination,
  PaginationParams,
} from '../common/decorators/paginationParams.decorator';
import {
  ISorting,
  SortingParams,
} from '../common/decorators/sortingParams.decorator';
import {
  FilteringParams,
  IFiltering,
} from '../common/decorators/filteringParams.decorator';
import { IAccountInfoFromRequest } from '../security/interfaces/accountInfoFromRequest.interface';
import { JwtAuthGuard } from '../security/strategies/guards/jwt-auth.guard';

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
  @UseGuards(JwtAuthGuard)
  async create(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Body(new ValidationPipe()) newThread: CreateThreadDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(
        await this.threadService.createTread(request.user.userId, newThread),
      );
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
