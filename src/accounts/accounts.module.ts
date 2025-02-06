import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { MailsService } from 'src/mails/mails.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account])],
  providers: [AccountsService, MailsService],
  controllers: [AccountsController],
})
export class AccountsModule {}
