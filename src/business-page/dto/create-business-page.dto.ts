import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateBusinessPageDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  desc: string;

  @IsOptional()
  accountId: string;
}
