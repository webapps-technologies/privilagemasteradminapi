import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDetailDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  fName: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  mName: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  lName: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(10)
  gender: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  email: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  address1: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  address2: string;

  @IsOptional()
  accountId: string;
}

export class PaginationSDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(50)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  keyword: string;
}

export class UpdateMemberDto {
  @IsOptional()
  email: string;

  @IsOptional()
  fName: string;

  @IsOptional()
  mName: string;

  @IsOptional()
  lName: string;

  @IsOptional()
  gender: string;

  @IsOptional()
  address1: string;

  @IsOptional()
  address2: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  zipcode: string;

  @IsOptional()
  businessType: string;

  @IsOptional()
  businessName: string;

  @IsOptional()
  gstNumber: string;

  @IsOptional()
  businessCity: string;

  @IsOptional()
  businessState: string;

  @IsOptional()
  businessZipcode: string;

  @IsOptional()
  businessPhone: string;

  // @IsNotEmpty()
  // membershipCardId: string;
}
