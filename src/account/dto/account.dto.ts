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
import { DefaultStatus, UserRole, YNStatus } from 'src/enum';

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
  salutation: string;

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
  landMark: string;

  @IsNotEmpty()
  zipcode: string;

  @IsOptional()
  qualification: string;

  @IsNotEmpty()
  aadharNumber: string;

  @IsNotEmpty()
  panNumber: string;

  @IsNotEmpty()
  haveBusiness: YNStatus;

  @IsOptional()
  businessType: string;

  @IsOptional()
  businessName: string;

  @IsOptional()
  businessEmail: string;

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

  @IsOptional()
  businessLandmark: string;

  @IsOptional()
  businessAddress1: string;

  @IsOptional()
  businessAddress2: string;

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

  @IsOptional()
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

export class PaginationChildDto {
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

export class SearchMemberPaginationDto {
  @IsOptional()
  memberId: string;

  @IsOptional()
  phoneNumber: string;
}
