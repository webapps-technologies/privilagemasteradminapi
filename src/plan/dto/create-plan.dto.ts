import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, MaxLength, MinLength } from 'class-validator';
import { PlanType } from 'src/enum';

export class CreatePlanDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  packageName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(1000)
  benefits: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  mrp: number;

  membership: string;

  duration: string; // In Days

  amcPrice: number;
  termsAndCond: string;
  type: PlanType;
  businessId: string;
}
