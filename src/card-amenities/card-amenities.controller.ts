import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CardAmenitiesService } from './card-amenities.service';
import { CreateCardAmenityDto } from './dto/create-card-amenity.dto';
import { UpdateCardAmenityDto } from './dto/update-card-amenity.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

@Controller('card-amenities')
export class CardAmenitiesController {
  constructor(private readonly cardAmenitiesService: CardAmenitiesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() Dto: CreateCardAmenityDto) {
    return this.cardAmenitiesService.create(Dto);
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  remove(@Param('id') id: string) {
    return this.cardAmenitiesService.remove(id);
  }
}
