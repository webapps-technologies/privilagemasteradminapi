import { IsOptional, IsUUID } from 'class-validator';

export class UpdateContractDto {
  @IsOptional()
  contractName: string;

  @IsOptional()
  @IsUUID()
  contractTypeId: string;

  @IsOptional()
  validFrom: Date;

  @IsOptional()
  validTill: Date;

  @IsOptional()
  desc: string;
}
