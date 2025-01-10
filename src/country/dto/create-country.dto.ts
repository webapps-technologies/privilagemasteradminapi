import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCountryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;
}
