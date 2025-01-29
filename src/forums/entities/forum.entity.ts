import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Subscribe } from './subscribe.entity';
import { Thread } from '../../thread/entities/thread.entity';

@Entity()
export class Forum {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, nullable: false })
  title: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  img_url: string;

  @CreateDateColumn()
  creation_date: Date;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  @OneToMany(() => Subscribe, (subscribe) => subscribe.forum)
  @JoinColumn({ name: 'id' })
  subscribers: Subscribe[];

  @OneToMany(() => Thread, (thread) => thread.forum)
  threads: Thread[];

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
