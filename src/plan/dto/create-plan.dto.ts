import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { DefaultStatus, PlanType } from 'src/enum';

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

  @IsNotEmpty()
  membership: string;

  @IsNotEmpty()
  duration: string; // In Days

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  amcPrice: number;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(5000)
  termsAndCond: string;

  @IsNotEmpty()
  @IsEnum(PlanType)
  type: PlanType;

  @IsOptional()
  @IsUUID()
  businessId: string;
}

export class PlanPaginationDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @IsOptional()
  @IsEnum(PlanType)
  type: PlanType;

  @IsOptional()
  businessId: string;
}
