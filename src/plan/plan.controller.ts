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
import { PlanService } from './plan.service';
import { CreatePlanDto, PlanPaginationDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePlanDto) {
    return this.planService.create(dto);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() dto: PlanPaginationDto) {
    return this.planService.findAll(dto);
  }

  @Get('list/license/:businessId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findForLicense(
    @Query() dto: CommonPaginationDto,
    @Param('businessId') businessId: string,
  ) {
    return this.planService.findForLicense(dto, businessId);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.planService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.planService.status(id, dto);
  }
}
