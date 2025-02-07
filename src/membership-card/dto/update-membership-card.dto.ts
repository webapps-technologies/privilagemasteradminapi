import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateMembershipCardDto {
  @IsOptional()
  name: string;

  @IsOptional()
  validYear: string;

  @IsOptional()
  validMonth: string;

  @IsOptional()
  price: string;

  @IsOptional()
  currencyType: string;

  @IsOptional()
  cardType: string;

  @IsOptional()
  @Type(() => Number)
  memberCount: number;
}
