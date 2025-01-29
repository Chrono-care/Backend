import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Forum } from './forum.entity';
import { Account } from 'src/accounts/entities/account.entity';

@Entity()
export class Subscribe {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Account, (account) => account.subscribes)
  account: Account;

  @ManyToOne(() => Forum, (forum) => forum.subscribers)
  forum: Forum;

  @CreateDateColumn()
  creation_date: Date;

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
