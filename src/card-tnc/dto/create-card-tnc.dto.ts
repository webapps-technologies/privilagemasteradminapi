import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCardTncDto {
  @IsNotEmpty()
  membershipCardId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(5000)
  terms: string;
}
