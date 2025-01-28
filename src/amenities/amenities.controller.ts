import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Put,
} from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateAmenityDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.amenitiesService.create(dto, user.id);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  findAll(
    @Query() dto: DefaultStatusPaginationDto,
    @CurrentUser() user: Account,
  ) {
    return this.amenitiesService.findAll(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateAmenityDto) {
    return this.amenitiesService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.amenitiesService.status(id, dto);
  }
}
