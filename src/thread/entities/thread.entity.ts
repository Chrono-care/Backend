import { Account } from 'src/accounts/entities/account.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Forum } from 'src/forums/entities/forum.entity';

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

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  ratio: number;

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

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
