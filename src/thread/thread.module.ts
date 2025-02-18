import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Thread } from './entities/thread.entity';
import { Account } from '../accounts/entities/account.entity';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';
import { Forum } from '../forums/entities/forum.entity';
import { VoteThread } from 'src/votethread/entities/votethread.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thread, Account, Forum, VoteThread])],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}
