import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateTaxDto {
    @IsNotEmpty()
    taxName: string;

    @IsNotEmpty()
    rate: string;

    @IsOptional()
    accountId: string;
}
