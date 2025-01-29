import { Module } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reply } from './entities/reply.entity';
import { Thread } from 'src/thread/entities/thread.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, Thread, Account])],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
