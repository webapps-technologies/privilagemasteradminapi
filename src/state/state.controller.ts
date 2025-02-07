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
import {} from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { BoolStatusDto } from 'src/common/dto/bool-status.dto';
import { UserRole } from 'src/enum';
import { PaginationSDto, StateDto, StateUpdateDto } from './dto/state.dto';
import { StateService } from './state.service';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  create(@Body() dto: StateDto) {
    return this.stateService.create(dto);
  }

  @Get('list/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  findAll(@Query() dto: PaginationSDto) {
    return this.stateService.findAll(dto);
  }

  @Get('list')
  find(@Query() dto: CommonPaginationDto){
    return this.stateService.find(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  update(@Param('id') id: string, @Body() dto: StateUpdateDto) {
    return this.stateService.update(+id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  status(@Param('id') id: string, @Body() dto: BoolStatusDto) {
    return this.stateService.status(+id, dto);
  }
}
