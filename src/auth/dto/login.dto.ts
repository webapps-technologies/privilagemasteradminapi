import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class MobLoginDto {
  @IsNotEmpty()
  loginId: string;

  @IsNotEmpty()
  deviceId: string;
}

export class WebLoginDto {
  @IsNotEmpty()
  loginId: string;
}

export class OtpDto {
  @IsNotEmpty()
  loginId: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  otp: number;
}

export class SigninDto {
  @IsNotEmpty()
  loginId: string;
}

export class AdminSigninDto {
  @IsNotEmpty()
  email: string;

  @IsOptional()
  password: string;
}

export class UserLoginDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserRegisterDto {
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  workStatus: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  mobileNumber: string;
}

export class ForgotPassDto {
  @IsOptional()
  @MinLength(0)
  @MaxLength(50)
  email: string;

  @IsOptional()
  newPassword: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  @MinLength(0)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsNumber()
  otp: string;
}

export class RecruiterRegisterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  mobileNumber: string;

  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  email: string;
  
  @IsNotEmpty()
  password: string;
}
