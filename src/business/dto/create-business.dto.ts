import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { BusinessStatus, Gender } from 'src/enum';

export class CreateBusinessDto {
  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  personName: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  personEmail: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  personPhone: string;

  @IsOptional()
  businessKey: string;

  @IsNotEmpty()
  businessType: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(500)
  businessName: string;

  @IsNotEmpty()
  @MinLength(15)
  @MaxLength(15)
  gstNo: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(200)
  address1: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(200)
  address2: string;

  @IsNotEmpty()
  zipCode: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  signatory: string;

  @IsOptional()
  accountId: string;
}

export class EmailVerifyDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(1)
  email: string;

  @IsOptional()
  otp: string;
}

export class PhoneVerifyDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsOptional()
  otp: string;
}

export class BusinessStatusDto {
  @IsNotEmpty()
  @IsEnum(BusinessStatus)
  status: BusinessStatus;
}

export class BusinessPaginationDto {
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

  @IsNotEmpty()
  @IsEnum(BusinessStatus)
  status: BusinessStatus;

  @IsOptional()
  fromDate: string;

  @IsOptional()
  toDate: string;
}
