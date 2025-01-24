import { IsOptional } from 'class-validator';

export class UpdateTaxDto {
  @IsOptional()
  taxName: string;

  @IsOptional()
  rate: string;

  @IsOptional()
  accountId: string;
}
