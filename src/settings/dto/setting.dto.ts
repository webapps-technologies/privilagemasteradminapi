import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SettingDto {
  @IsOptional()
  @IsUrl()
  user_domain: string;

  @IsOptional()
  @IsUrl()
  admin_domain: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(150)
  mobile_domain: string;

  @IsOptional()
  dateFormat: string;

  @IsOptional()
  timeFormat: string;

  @IsOptional()
  timeZone: string;

  @IsNotEmpty()
  accountId: string;
}

export class UpdateSettingDto {
  @IsOptional()
  @IsUrl()
  user_domain: string;

  @IsOptional()
  @IsUrl()
  admin_domain: string;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(150)
  mobile_domain: string;

  @IsOptional()
  dateFormat: string;

  @IsOptional()
  timeFormat: string;

  @IsOptional()
  timeZone: string;

  @IsOptional()
  currency: string;
}
