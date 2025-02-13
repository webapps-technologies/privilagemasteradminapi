import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateUserChildDto {
  @IsNotEmpty()
  accountId: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  relation: string;

  @IsNotEmpty()
  martialStatus: string;

  @IsNotEmpty()
  @Type(() => Number)
  age: number;

  @IsOptional()
  memberId: string;
}

export class CreateByUserChildDto {
  @IsOptional()
  accountId: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(10)
  phoneNumber: string;

  @IsNotEmpty()
  relation: string;

  @IsNotEmpty()
  martialStatus: string;

  @IsNotEmpty()
  @Type(() => Number)
  age: number;

  @IsOptional()
  memberId: string;
}
