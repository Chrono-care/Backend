/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreateForumDto } from './create-forum.dto';

export class UpdateForumDto extends PartialType(CreateForumDto) {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  img_url: string;

  @IsNotEmpty()
  @IsBoolean()
  is_archived: boolean;
}
