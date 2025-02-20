import { Account } from '../../accounts/entities/account.entity';
import { Forum } from '../../forums/entities/forum.entity';
import { VoteThread } from './votethread.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Expose, instanceToPlain } from 'class-transformer';

@Entity()
export class Thread {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl: string;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.threads)
  author: Account;

  @ManyToOne(() => Forum, (forum) => forum.threads)
  forum: Forum;

  @OneToMany(() => VoteThread, (votethread) => votethread.thread, {
    eager: true,
  })
  votethreads: VoteThread[];

  @Expose()
  get ratio(): number {
    if (!this.votethreads || this.votethreads.length === 0) return 0;

    return this.votethreads.reduce(
      (sum, vote) => sum + (vote.voteType ? 1 : -1),
      0,
    );
  }

  toJSON(): Record<string, unknown> {
    const plain = instanceToPlain(this);
    return { ...plain, ratio: this.ratio };
  }
}
