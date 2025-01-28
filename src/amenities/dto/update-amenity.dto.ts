import { IsOptional } from 'class-validator';

export class UpdateAmenityDto {
  @IsOptional()
  name: string;

  @IsOptional()
  shortDesc: string;

  @IsOptional()
  desc: string;
}
