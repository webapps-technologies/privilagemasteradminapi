import { IsNotEmpty } from "class-validator";

export class CreateCardAmenityDto {
    @IsNotEmpty()
    membershipCardId: string;

    @IsNotEmpty()
    amenitiesId: [];
}
