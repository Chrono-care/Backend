import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
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
import {
  IPagination,
  PaginationParams,
} from '../common/decorators/paginationParams.decorator';
import {
  ISorting,
  SortingParams,
} from '../common/decorators/sortingParams.decorator';
import {
  IFiltering,
  FilteringParams,
} from '../common/decorators/filteringParams.decorator';
import { Response } from 'express';
import { CreateForumDto } from './dto/create-forum.dto';
import { UpdateForumDto } from './dto/update-forum.dto';
import { ForumsService } from './forums.service';
import { IAccountInfoFromRequest } from 'src/security/interfaces/accountInfoFromRequest.interface';
import { JwtAuthGuard } from 'src/security/strategies/guards/jwt-auth.guard';

const authorizedFields = ['id', 'title', 'description', 'is_archived'];

@Controller('forum')
export class forumsController {
  constructor(private readonly forumsService: ForumsService) {}

  @Get()
  async getAll(
    @Res() response: Response,
    @PaginationParams({}) pagination: IPagination,
    @SortingParams(authorizedFields) sort?: ISorting,
    @FilteringParams(authorizedFields) filter?: IFiltering[],
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

  @Delete('/delete/:id')
  async delete(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.deleteForum(id));
  }

  @Get('/subscribers/:id')
  async getSubscribers(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.getSubscribers(id));
  }

  @Post('/subscribe/me/:forumId')
  @UseGuards(JwtAuthGuard)
  async subscribe(
    @Res() response: Response,
    @Param('forumId', ParseIntPipe) forumId: number,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(
        await this.forumsService.addSubscriber(forumId, request.user.userId),
      );
  }

  @Delete('/subscribe/me/:forumId')
  @UseGuards(JwtAuthGuard)
  async unsubscribe(
    @Res() response: Response,
    @Param('forumId', ParseIntPipe) forumId: number,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(
        await this.forumsService.removeSubscriber(forumId, request.user.userId),
      );
  }

  @Post('/subscribe/:forumId/:accountId')
  async addSubscriber(
    @Res() response: Response,
    @Param('forumId', ParseIntPipe) forumId: number,
    @Param('accountId') accountId: string,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(await this.forumsService.addSubscriber(forumId, accountId));
  }

  @Delete('/subscribe/:forumId/:accountId')
  async removeSubscriber(
    @Res() response: Response,
    @Param('forumId', ParseIntPipe) forumId: number,
    @Param('accountId') accountId: string,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.forumsService.removeSubscriber(forumId, accountId));
  }
}
