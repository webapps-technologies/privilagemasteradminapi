import { IsOptional, MinLength, MaxLength, IsString } from 'class-validator';
import { Gender } from 'src/enum';

export class UpdateBusinessDto {
  @IsOptional()
  gender: Gender;

  @IsOptional()
  personName: string;

  @IsOptional()
  personEmail: string;

  @IsOptional()
  personPhone: string;

  @IsOptional()
  businessType: string;

  @IsOptional()
  @IsString()
  businessName: string;

  @IsOptional()
  gstNo: string;

  @IsOptional()
  address1: string;

  @IsOptional()
  address2: string;

  @IsOptional()
  zipCode: string;

  @IsOptional()
  city: string;

  @IsOptional()
  state: string;

  @IsOptional()
  country: string;

  @IsOptional()
  signatory: string;

  @IsOptional()
  accountId: string;
}
