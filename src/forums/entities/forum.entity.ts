import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Thread } from 'src/thread/entities/thread.entity';

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

  @OneToMany(() => Thread, (thread) => thread.forum)
  threads: Thread[];

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
