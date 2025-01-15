import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateContractTypeDto {
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;
}
