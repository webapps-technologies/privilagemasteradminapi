import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsOptional()
  accountId: string;

  @IsNotEmpty()
  heading: string;

  @IsNotEmpty()
  desc: string;
}
