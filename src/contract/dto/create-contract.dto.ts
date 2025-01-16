import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { DefaultStatus } from 'src/enum';

export class CreateContractDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  contractName: string;

  @IsNotEmpty()
  @IsUUID()
  contractTypeId: string;

  @IsNotEmpty()
  validFrom: Date;

  @IsNotEmpty()
  validTill: Date;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15000)
  desc: string;

  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
