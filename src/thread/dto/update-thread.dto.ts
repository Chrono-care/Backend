/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateThreadDto } from './create-thread.dto';

export class UpdateThreadDto extends PartialType(CreateThreadDto) {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsBoolean()
  is_archived: boolean = false;

  @IsNotEmpty()
  @IsInt()
  forumId: number;
}
