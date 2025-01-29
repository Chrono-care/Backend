import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReplyDto } from './create-reply.dto';

export class UpdateReplyDto extends PartialType(CreateReplyDto) {
  @IsNotEmpty()
  @IsString()
  content: string;
}
