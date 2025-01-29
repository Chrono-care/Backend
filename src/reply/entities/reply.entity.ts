import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Account } from 'src/accounts/entities/account.entity';
import { Thread } from 'src/thread/entities/thread.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => Account, (account) => account.replies)
  author: Account;

  @ManyToOne(() => Thread, (thread) => thread.replies)
  thread: Thread;

  @ManyToOne(() => Reply, (reply) => reply.responses, { nullable: true })
  responseTo: Reply | null;

  @OneToMany(() => Reply, (reply) => reply.responseTo)
  responses: Reply[];

  @CreateDateColumn()
  creation_date: Date;

  @UpdateDateColumn()
  update_date: Date;
}
