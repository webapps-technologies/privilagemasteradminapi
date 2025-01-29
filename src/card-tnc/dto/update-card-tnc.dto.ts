import { IsOptional, IsString } from 'class-validator';

export class UpdateCardTncDto {
  @IsOptional()
  @IsString()
  terms: string;
}
