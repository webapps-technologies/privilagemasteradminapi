import { IsOptional } from 'class-validator';

export class UpdateCardAmenityDto {
  @IsOptional()
  name: string;

  @IsOptional()
  shortDesc: string;

  @IsOptional()
  desc: string;
}
