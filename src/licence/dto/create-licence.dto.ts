import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLicenceDto {
  @IsNotEmpty()
  @IsUUID()
  businessId: string;

  @IsNotEmpty()
  @Type(() => Number)
  userLimit: number;

  @IsNotEmpty()
  @IsUUID()
  planId: string;
}
