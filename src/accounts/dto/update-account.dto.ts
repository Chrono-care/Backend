import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsEmpty()
  @Exclude()
  password: string;

  @IsEmpty()
  @Exclude()
  karma: number;

  @IsEmpty()
  @Exclude()
  global_bantime: Date;
}
