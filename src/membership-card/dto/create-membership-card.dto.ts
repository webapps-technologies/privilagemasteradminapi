import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { DefaultStatus } from 'src/enum';

export class CreateMembershipCardDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  validity: string;

  @IsNotEmpty()
  price: string;

  @IsNotEmpty()
  currencyType: string;

  @IsNotEmpty()
  @Type(() => Number)
  memberCount: number;

  @IsOptional()
  accountId: string;
}

export class MembershipCardPaginationDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(10)
  @Max(100)
  limit: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  offset: number;

  @IsOptional()
  @IsString()
  @MinLength(0)
  @MaxLength(100)
  keyword: string;

  @IsNotEmpty()
  @IsEnum(DefaultStatus)
  status: DefaultStatus;
}
