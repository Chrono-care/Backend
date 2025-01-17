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

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
