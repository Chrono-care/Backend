import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  Timestamp,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as argon2 from 'argon2';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Subscribe } from 'src/forums/entities/subscribe.entity';

@Entity()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ nullable: false, default: 0 })
  karma: number;

  @Column({ type: 'bigint', unsigned: true, default: 0 })
  global_bantime: Timestamp;

  @Column({ default: false })
  validated: boolean;

  @OneToMany(() => Subscribe, (subscribe) => subscribe.account)
  @JoinColumn({ name: 'uuid' })
  subscribes: Subscribe[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await argon2.hash(this.password);
  }

  toJSON(): Record<string, unknown> {
    return instanceToPlain(this);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await argon2.verify(this.password, candidatePassword);
  }
}
