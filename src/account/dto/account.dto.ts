import { Type } from 'class-transformer';
import {
  IsDate,
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
import { DefaultStatus, UserRole } from 'src/enum';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  loginId: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  name: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(55)
  email: string;

  @IsOptional()
  dob: Date;
}

export class UpdateStaffPasswordDto {
  @IsOptional()
  @IsString()
  loginId: string;

  @IsOptional()
  password: string;
}

export class UpdateStaffDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  dob: Date;
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
  @Max(1000)
  offset: number;

  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsOptional()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}

export class StatusDto {
  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}

export class EmailUpdateDto {
  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(50)
  email: string;

  @IsOptional()
  otp: string;
}

export class AddMemberDto {
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  fName: string;

  @IsNotEmpty()
  mName: string;

  @IsNotEmpty()
  lName: string;

  @IsNotEmpty()
  gender: string;

  @IsNotEmpty()
  address1: string;

  @IsNotEmpty()
  address2: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  state: string;

  @IsNotEmpty()
  zipcode: string;

  @IsNotEmpty()
  businessType: string;

  @IsNotEmpty()
  businessName: string;

  @IsNotEmpty()
  gstNumber: string;

  @IsNotEmpty()
  businessCity: string;

  @IsNotEmpty()
  businessState: string;

  @IsNotEmpty()
  businessZipcode: string;

  @IsNotEmpty()
  businessPhone: string;

  @IsNotEmpty()
  membershipCardId: string;
}

export class MemberPaginationDto {
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
  @Max(1000)
  offset: number;

  @IsOptional()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  membershipType: string;

  @IsOptional()
  memberId: string;

  @IsOptional()
  startDate: string;

  @IsOptional()
  endDate: string;
}
