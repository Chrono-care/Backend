import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteThread } from './entities/votethread.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Thread } from 'src/thread/entities/thread.entity';
import { VoteThreadController } from './votethread.controller';
import { VoteThreadService } from './votethread.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoteThread, Thread, Account])],
  controllers: [VoteThreadController],
  providers: [VoteThreadService],
})
export class VoteThreadModule {}
