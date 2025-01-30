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
