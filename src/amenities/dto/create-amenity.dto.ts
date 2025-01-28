import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAmenityDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  shortDesc: string;

  @IsNotEmpty()
  desc: string;

  @IsOptional()
  accountId: string;
}
