import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateOtherMembershipDto {
  @IsOptional()
  accountId: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  clubName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  duration: string;
}
