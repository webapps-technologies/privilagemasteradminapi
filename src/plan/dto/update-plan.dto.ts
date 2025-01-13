import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsUUID } from 'class-validator';
import { PlanType } from 'src/enum';

export class UpdatePlanDto {
  @IsOptional()
  packageName: string;

  @IsOptional()
  benefits: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mrp: number;

  @IsOptional()
  membership: string;

  @IsOptional()
  duration: string; // In Days

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amcPrice: number;

  @IsOptional()
  termsAndCond: string;

  @IsOptional()
  type: PlanType;

  @IsOptional()
  @IsUUID()
  businessId: string;
}
