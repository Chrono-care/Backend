import { Account } from 'src/accounts/entities/account.entity';
import { Thread } from 'src/thread/entities/thread.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

@Entity()
export class VoteThread {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'boolean' })
  voteType: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Account, (account) => account.votethread)
  author: Account;

  @ManyToOne(() => Thread, (thread) => thread.votethreads)
  thread: Thread;

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
