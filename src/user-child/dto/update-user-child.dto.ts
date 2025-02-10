import { IsOptional } from 'class-validator';

export class UpdateUserChildDto {
  @IsOptional()
  name: string;

  @IsOptional()
  email: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  relation: string;

  @IsOptional()
  martialStatus: string;
}
