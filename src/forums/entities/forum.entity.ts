import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

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

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
