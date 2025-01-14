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
import { LicenceService } from './licence.service';
import { CreateLicenceDto } from './dto/create-licence.dto';
import { UpdateLicenceDto } from './dto/update-licence.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

@Controller('licence')
export class LicenceController {
  constructor(private readonly licenceService: LicenceService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateLicenceDto) {
    return this.licenceService.create(dto);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.licenceService.findAll();
  }

  @Patch('renewal/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  renewal(@Param('id') id: string, @Body() dto: UpdateLicenceDto) {
    return this.licenceService.renewal(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licenceService.remove(+id);
  }
}
