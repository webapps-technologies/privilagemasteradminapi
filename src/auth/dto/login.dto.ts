import { Type } from 'class-transformer';
import {
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
  @IsNumber()
  otp: string;
}
