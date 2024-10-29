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
import { Account } from './entities/account.entity';
import { Response } from 'express';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from 'src/security/strategies/guards/jwt-auth.guard';
import { IAccountInfoFromRequest } from 'src/security/interfaces/accountInfoFromRequest.interface';
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
import { AccountsService } from './accounts.service';

const authorizedFields = [
  'uuid',
  'email',
  'firstname',
  'lastname',
  'phone',
  'karma',
  'validated',
  'global_bantime',
];

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  /**
   * Get all accounts.
   *
   * @param response - The HTTP response object.
   * @param pagination - The pagination parameters.
   * @param sort - The ISorting parameters.
   * @param filter - The IFiltering parameters.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Get()
  async getAll(
    @Res() response: Response,
    @PaginationParams({}) pagination: IPagination,
    @SortingParams(authorizedFields) sort?: ISorting,
    @FilteringParams(authorizedFields) filter?: IFiltering[],
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(
        await this.accountsService.getAllAccounts(pagination, sort, filter),
      );
  }

  /**
   * Get the current account information.
   *
   * @param response - The HTTP response object.
   * @param request - The account information from the request.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Get('/info/me')
  @UseGuards(JwtAuthGuard)
  async getCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    return response
      .status(HttpStatus.OK)
      .json(await this.accountsService.getAccountById(request.user.userId));
  }

  /**
   * Create a new account.
   *
   * @param response - The HTTP response object.
   * @param account - The account data.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Post('/create')
  async create(
    @Res() response: Response,
    @Body(ValidationPipe) account: CreateAccountDto,
  ): Promise<Response> {
    const newAccount: Account =
      await this.accountsService.createAccount(account);
    return response.status(HttpStatus.CREATED).json({
      message: 'Bienvenue ! Votre compte a été créé avec succès.',
      newAccount,
    });
  }

  /**
   * Update an account by UUID.
   *
   * @param response - The HTTP response object.
   * @param uuid - The UUID of the account to update.
   * @param account - The updated account data.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Patch('/update/uuid/:uuid')
  async update(
    @Res() response: Response,
    @Param('uuid') uuid: string,
    @Body(ValidationPipe) account: UpdateAccountDto,
  ): Promise<Response> {
    const updatedAccount: Account = await this.accountsService.updateAccount(
      uuid,
      account,
    );
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur mis à jour avec succès.',
      updatedAccount,
    });
  }

  /**
   * Update the current account.
   *
   * @param response - The HTTP response object.
   * @param request - The account information from the request.
   * @param account - The updated account data.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Patch('/update/me')
  @UseGuards(JwtAuthGuard)
  async updateCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
    @Body(ValidationPipe) account: UpdateAccountDto,
  ): Promise<Response> {
    const updatedAccount: Account = await this.accountsService.updateAccount(
      request.user.userId,
      account,
    );
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur mis à jour avec succès.',
      updatedAccount,
    });
  }

  /**
   * Delete an account by UUID.
   *
   * @param response - The HTTP response object.
   * @param uuid - The UUID of the account to delete.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Delete('/delete/uuid/:uuid')
  async delete(
    @Res() response: Response,
    @Param('uuid') uuid: string,
  ): Promise<Response> {
    await this.accountsService.deleteAccount(uuid);
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur supprimé avec succès.',
    });
  }

  /**
   * Delete the current account.
   *
   * @param response - The HTTP response object.
   * @param request - The account information from the request.
   * @returns A Promise that resolves to the HTTP response.
   */
  @Delete('/delete/me')
  @UseGuards(JwtAuthGuard)
  async deleteCurrentAccount(
    @Res() response: Response,
    @Request() request: IAccountInfoFromRequest,
  ): Promise<Response> {
    await this.accountsService.deleteAccount(request.user.userId);
    return response.status(HttpStatus.OK).json({
      message: 'Utilisateur supprimé avec succès.',
    });
  }
}
