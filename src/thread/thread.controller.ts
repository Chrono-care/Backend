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
import { UpdateThreadDto } from './dto/update-thread.dto';
import { CreateVoteThreadDto } from 'src/votethread/dto/create-votethread.dto';

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
      .json(await this.threadService.getAllThreads(pagination, sort, filter));
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
        await this.threadService.createThread(request.user.userId, newThread),
      );
  }

  @Patch('/update/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Request() request: IAccountInfoFromRequest,
    @Body(new ValidationPipe()) updatedThread: UpdateThreadDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(
        await this.threadService.updateThread(
          id,
          request.user.userId,
          updatedThread,
        ),
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
      .json(await this.threadService.archiveThread(id, set));
  }

  @Post('/vote')
  @UseGuards(JwtAuthGuard)
  async vote(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Body(new ValidationPipe()) voteData: CreateVoteThreadDto,
  ): Promise<Response> {
    const updatedThread = await this.threadService.voteThread(
      request.user.userId,
      voteData.threadId,
      voteData.voteType,
    );
    return response.status(HttpStatus.OK).json(updatedThread);
  }

  @Delete('/vote/remove/:id')
  @UseGuards(JwtAuthGuard)
  async removeAllVotes(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    const updatedThread = await this.threadService.removeAllVotesFromThread(id);
    return response.status(HttpStatus.OK).json(updatedThread);
  }
}
