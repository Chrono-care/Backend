import {
  Controller,
  Get,
  Res,
  HttpStatus,
  Post,
  Body,
  ValidationPipe,
  Patch,
  Delete,
  ParseIntPipe,
  Param,
  ParseBoolPipe,
  DefaultValuePipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
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
import { CreateReplyDto } from './dto/create-reply.dto';
import { UpdateReplyDto } from './dto/update-reply.dto';
import { JwtAuthGuard } from 'src/security/strategies/guards/jwt-auth.guard';
import { IAccountInfoFromRequest } from 'src/security/interfaces/accountInfoFromRequest.interface';

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

  @Post('/create/forthread/:threadId')
  @UseGuards(JwtAuthGuard)
  async createForThread(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Param('threadId', ParseIntPipe) threadId: number,
    @Body(new ValidationPipe()) newReply: CreateReplyDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(
        await this.replyService.createForThread(
          request.user.userId,
          newReply,
          threadId,
        ),
      );
  }

  @Post('/create/forreply/:replyId')
  @UseGuards(JwtAuthGuard)
  async createForReply(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Param('replyId', ParseIntPipe) replyId: number,
    @Body(new ValidationPipe()) newReply: CreateReplyDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.CREATED)
      .json(
        await this.replyService.createForReply(
          request.user.userId,
          newReply,
          replyId,
        ),
      );
  }

  @Patch('/update/:id')
  async update(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updatedReply: UpdateReplyDto,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.replyService.updateReply(updatedReply, id));
  }

  @Patch('/archive/:id')
  async archive(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
    @Query('set', new DefaultValuePipe(true), ParseBoolPipe) set: boolean,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.replyService.archiveReply(id, set));
  }

  @Delete('/delete/:id')
  async delete(
    @Res() response: Response,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.replyService.deleteReply(id));
  }
}
