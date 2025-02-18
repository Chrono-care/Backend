/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { CreateVoteThreadDto } from './create-votethread.dto';

export class UpdateVoteThreadDto extends PartialType(CreateVoteThreadDto) {
  @IsOptional()
  @IsBoolean()
  voteType: boolean | null;

  @IsNotEmpty()
  @IsInt()
  threadId: number;
}
