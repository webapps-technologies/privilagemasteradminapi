import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";

export class CreateContactUsDto {
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    fName: string;
    
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    lName: string;
    
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(10)
    phoneNumber: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    email: string;
    
    @IsNotEmpty()
    query: string;

    @IsNotEmpty()
    message: string;
}
