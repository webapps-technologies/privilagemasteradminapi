import { IsNotEmpty } from 'class-validator';

export class CreateCardAmenityDto {
  @IsNotEmpty()
  membershipCardId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  shortDesc: string;

  @IsNotEmpty()
  desc: string;
}
