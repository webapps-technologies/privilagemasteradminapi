import { IsNotEmpty } from 'class-validator';

export class CreateUserChildDto {
  @IsNotEmpty()
  userDetailId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  relation: string;

  @IsNotEmpty()
  martialStatus: string;
}
