import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SecurityService } from './security.service';
import { LoginRequest } from './interfaces/authenticated.interface';
import { Response } from 'express';
import { LocalAuthGuard } from './strategies/guards/local-auth.guard';
import { Account } from 'src/accounts/entities/account.entity';

@Controller()
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Res() response: Response,
    @Req() req: LoginRequest,
  ): Promise<Response> {
    const token = await this.securityService.login(req.user as Account);
    return response.status(HttpStatus.OK).json({ token: token.access_token });
  }
}
