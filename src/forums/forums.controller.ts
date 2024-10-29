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
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumsService } from './forums.service';

const authorizedFields = ['id', 'title', 'description'];

@Controller('forums')
export class forumsController {
  constructor(private readonly forumsService: ForumsService) {}

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

  @Post('/create')
  async create(
    @Res() response: Response,
    @Body(new ValidationPipe()) newForum: CreateForumDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(await this.forumsService.createForum(newForum));
  }

  @Patch('/update/:id')
  async update(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatedForum: UpdateForumDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.updateForum(id, updatedForum));
  }

  @Patch('/archive/:id')
  async archive(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Query('set', new DefaultValuePipe(true), ParseBoolPipe) set: boolean,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.archiveForum(id, set));
  }
}
