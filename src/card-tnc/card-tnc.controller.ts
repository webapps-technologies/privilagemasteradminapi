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
import { CardTncService } from './card-tnc.service';
import { CreateCardTncDto } from './dto/create-card-tnc.dto';
import { UpdateCardTncDto } from './dto/update-card-tnc.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

@Controller('card-tnc')
export class CardTncController {
  constructor(private readonly cardTncService: CardTncService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateCardTncDto) {
    return this.cardTncService.create(dto);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateCardTncDto) {
    return this.cardTncService.update(id, dto);
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  remove(@Param('id') id: string) {
    return this.cardTncService.remove(id);
  }
}
