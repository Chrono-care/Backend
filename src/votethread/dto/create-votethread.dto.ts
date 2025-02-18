import { IsNotEmpty, IsInt, IsBoolean, IsOptional } from 'class-validator';

export class CreateVoteThreadDto {
  @IsOptional()
  @IsBoolean()
  voteType: boolean | null;

  @IsNotEmpty()
  @IsInt()
  threadId: number;
}
