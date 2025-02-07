import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BoolStatusDto } from 'src/common/dto/bool-status.dto';
import { UserRole } from 'src/enum';
import { CityService } from './city.service';
import { CityDto, PaginationSDto, UpdateCityDto } from './dto/city.dto';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  create(@Body() dto: CityDto) {
    return this.cityService.create(dto);
  }

  @Get('list/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  findAll(@Query() dto: PaginationSDto) {
    return this.cityService.findAll(dto);
  }

  @Get('list')
  find(@Query() dto: CommonPaginationDto) {
    return this.cityService.find(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  update(@Param('id') id: string, @Body() dto: UpdateCityDto) {
    return this.cityService.update(+id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  status(@Param('id') id: string, @Body() dto: BoolStatusDto) {
    return this.cityService.status(+id, dto);
  }
}
