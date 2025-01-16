import { IsNotEmpty } from 'class-validator';

export class CreateBusinessContractDto {
  @IsNotEmpty()
  businessId: string;

  @IsNotEmpty()
  // contractId: string;
  contractId: [];
}
