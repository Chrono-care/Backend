import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Thread } from 'src/thread/entities/thread.entity';
import { Repository } from 'typeorm';
import { VoteThread } from './entities/votethread.entity';
@Injectable()
export class VoteThreadService {
  constructor(
    @InjectRepository(VoteThread)
    private readonly votethreadRepository: Repository<VoteThread>,

    @InjectRepository(Thread)
    private readonly threadRepository: Repository<Thread>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}
}
