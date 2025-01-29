import { PartialType } from '@nestjs/swagger';
import { CreateCardAmenityDto } from './create-card-amenity.dto';

export class UpdateCardAmenityDto extends PartialType(CreateCardAmenityDto) {}
