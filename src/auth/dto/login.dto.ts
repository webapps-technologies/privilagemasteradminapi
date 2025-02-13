import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
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
  @MinLength(10)
  @MaxLength(10)
  loginId: string;
}

export class AdminSigninDto {
  @IsNotEmpty()
  email: string;

  @IsOptional()
  password: string;
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
  @Type(() => Number)
  @IsNumber()
  otp: string;
}

export class BusinessCreateDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class BusinessLoginDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class BusinessForgotDto{
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;
}

export class BusinessResetDto{
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  newPassword: string;
}
