import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
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
import { CompanyStatus } from 'src/enum';

export class CompanyDetailDto {
  @IsOptional()
  @MinLength(0)
  @MaxLength(150)
  companyName: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  mobileNumber: string;

  @IsOptional()
  shortDesc: string;

  @IsOptional()
  designation: string;

  @IsOptional()
  city: string;

  @IsOptional()
  address: string;

  @IsOptional()
  companyEmail: string;

  @IsOptional()
  companyURL: string;

  @IsOptional()
  companySize: string;

  @IsOptional()
  gstNumber: string;
}

export class RatingUpdateDto {
  @IsOptional()
  @MinLength(0)
  @MaxLength(150)
  companyName: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  mobileNumber: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  companyType: string;

  @IsOptional()
  rating: string;

  @IsOptional()
  reviews: string;
}

export class StatusDto {
  @IsNotEmpty()
  @IsEnum(CompanyStatus)
  status: CompanyStatus;
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

  @IsNotEmpty()
  @IsEnum(CompanyStatus)
  status: CompanyStatus;
}

export class PaginationDto {
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

  @IsOptional()
  @IsArray()
  category: any; // [1,2,3,4,5]

  @IsOptional()
  @IsArray()
  subCategory: any; // [1,2,3,4,5]
}
