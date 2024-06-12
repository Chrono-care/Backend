import {
  Controller,
  HttpStatus,
  Post,
  Res,
  Get,
  Body,
  ValidationPipe,
  Param,
  Patch,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { Account } from './entities/account.entity';
import { Response } from 'express';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/security/strategies/guards/jwt-auth.guard';
import { IAccountInfoFromRequest } from 'src/security/interfaces/accountInfoFromRequest.interface';
import {
  Pagination,
  PaginationParams,
} from './decorators/paginationParams.decorator';
import { Sorting, SortingParams } from './decorators/sortingParams.decorator';
import {
  Filtering,
  FilteringParams,
} from './decorators/filteringParams.decorator';
import { GrpcMethod } from '@nestjs/microservices';

const authorizedFields = [
  'id',
  'email',
  'firstname',
  'lastname',
  'phone',
  'karma',
  'validated',
  'global_bantime',
]

@Controller('accounts')
export class AccountsController {
  constructor(private readonly AccountsService: AccountsService) {}
  
  @Get()
  async getAll(
    @Res() response: Response,
    @PaginationParams({}) pagination: Pagination,
    @SortingParams(authorizedFields) sort?: Sorting,
    @FilteringParams(authorizedFields) filter?: Filtering,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(
        await this.AccountsService.getAllAccounts(pagination, sort, filter),
      );
  }

  // Whoami
  @Get('/info/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.AccountsService.getAccountById(request.account.uuid));
  }

  @Post('/create')
  async create(
    @Res() response: Response,
    @Body(ValidationPipe) account: CreateAccountDto,
  ): Promise<Response> {
    const newAccount: Account =
      await this.AccountsService.createAccount(account);
    return response.status(HttpStatus.CREATED).json({
      message: 'Bienvenue ! Votre compte a été créé avec succès.',
      newAccount,
    });
  }

  @Patch('/update/uuid/:uuid')
  async update(
    @Res() response: Response,
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) account: UpdateAccountDto,
  ): Promise<Response> {
    const updatedAccount: Account = await this.AccountsService.updateAccount(
      uuid,
      account,
    );
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur mis à jour avec succès.',
      updatedAccount,
    });
  }

  @Patch('/update/me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Body(ValidationPipe) account: UpdateAccountDto,
  ): Promise<Response> {
    const updatedAccount: Account = await this.AccountsService.updateAccount(
      request.account.uuid,
      account,
    );
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur mis à jour avec succès.',
      updatedAccount,
    });
  }

  @Delete('/delete/uuid/:uuid')
  async delete(
    @Res() response: Response,
    @Param('uuid') uuid: string,
  ): Promise<Response> {
    await this.AccountsService.deleteAccount(uuid);
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur supprimé avec succès.',
    });
  }

  @Delete('/delete/me')
  @UseGuards(JwtAuthGuard)
  async deleteCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    await this.AccountsService.deleteAccount(request.account.uuid);
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur supprimé avec succès.',
    });
  }
}
