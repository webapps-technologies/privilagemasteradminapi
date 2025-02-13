import { IsOptional } from 'class-validator';

export class UpdateBusinessPageDto {
  @IsOptional()
  name: string;
  
  @IsOptional()
  desc: string;
}
