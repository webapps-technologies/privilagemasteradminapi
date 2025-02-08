import { IsNotEmpty } from 'class-validator';

export class CreateBusinessContractDto {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  // contractId: string;
  contractId: [];
}
