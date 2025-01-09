import { IsNotEmpty } from 'class-validator';

export class CreateBusinessTypeDto {
  @IsNotEmpty()
  name: string;
}
