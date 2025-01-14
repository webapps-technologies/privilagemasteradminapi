import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LicencePlanService } from './licence-plan.service';
import { CreateLicencePlanDto } from './dto/create-licence-plan.dto';
import { UpdateLicencePlanDto } from './dto/update-licence-plan.dto';

@Controller('licence-plan')
export class LicencePlanController {
  constructor(private readonly licencePlanService: LicencePlanService) {}

  @Post()
  create(@Body() createLicencePlanDto: CreateLicencePlanDto) {
    return this.licencePlanService.create(createLicencePlanDto);
  }

  @Get()
  findAll() {
    return this.licencePlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licencePlanService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLicencePlanDto: UpdateLicencePlanDto) {
    return this.licencePlanService.update(+id, updateLicencePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.licencePlanService.remove(+id);
  }
}
