import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { YNStatus } from 'src/enum';

export class UpdateLicenceDto {
  @IsOptional()
  @Type(() => Number)
  userLimit: number;

  @IsOptional()
  amc: YNStatus;
}
