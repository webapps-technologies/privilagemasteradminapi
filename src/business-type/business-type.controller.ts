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
import { BusinessTypeService } from './business-type.service';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Controller('business-type')
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateBusinessTypeDto) {
    return this.businessTypeService.create(dto);
  }

  @Get()
  findAll(@Query() dto: DefaultStatusPaginationDto) {
    return this.businessTypeService.findAll(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: CreateBusinessTypeDto) {
    return this.businessTypeService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.businessTypeService.status(id, dto);
  }
}
