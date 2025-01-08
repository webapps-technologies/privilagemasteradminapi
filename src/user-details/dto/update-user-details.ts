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
  IsEnum,
} from 'class-validator';
import { EducationLevel, ExperienceLevel, LanguageLevel } from 'src/enum';

export class UpdateUserDetailDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  workStatus: string;

  @IsOptional()
  city: string;

  @IsOptional()
  area: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  mobileNumber: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(10)
  gender: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  dob: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  currLocation: string;

  @IsOptional()
  @MinLength(0)
  @MaxLength(500)
  hometown: string;

  @IsOptional()
  totalExpYear: string;

  @IsOptional()
  totalExpMonth: string;
  
  @IsOptional()
  currSalary: string;

  @IsOptional()
  englishLevel: LanguageLevel;

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
