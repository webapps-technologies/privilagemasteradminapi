import { IsEmail, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateBusinessDto {
  @IsNotEmpty()
  businessType: string;

  @IsNotEmpty()
  businessName: string;

  @IsNotEmpty()
  gstNo: string;

  @IsNotEmpty()
  address1: string;

  @IsNotEmpty()
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
