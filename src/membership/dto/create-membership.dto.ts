import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateMembershipDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;
}
