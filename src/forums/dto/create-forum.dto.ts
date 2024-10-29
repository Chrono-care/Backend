/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength, MaxLength, IsBoolean } from 'class-validator';

export class CreateForumDto {
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
