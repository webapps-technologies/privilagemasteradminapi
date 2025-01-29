import { PartialType } from '@nestjs/swagger';
import { CreateCardGalleryDto } from './create-card-gallery.dto';

export class UpdateCardGalleryDto extends PartialType(CreateCardGalleryDto) {}
