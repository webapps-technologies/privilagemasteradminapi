import { PartialType } from '@nestjs/swagger';
import { CreateBusinessContractDto } from './create-business-contract.dto';

export class UpdateBusinessContractDto extends PartialType(CreateBusinessContractDto) {}
