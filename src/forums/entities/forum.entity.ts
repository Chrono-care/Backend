import { Entity, PrimaryGeneratedColumn, Column, Timestamp } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { now } from 'moment';

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

  @Column({ type: 'bigint', unsigned: true, default: now() })
  creation_date: Timestamp;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }
}
