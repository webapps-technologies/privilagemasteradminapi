import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LicencePlanService } from './licence-plan.service';
import { CreateLicencePlanDto } from './dto/create-licence-plan.dto';
import { UpdateLicencePlanDto } from './dto/update-licence-plan.dto';

@Controller('licence-plan')
export class LicencePlanController {
  constructor(private readonly licencePlanService: LicencePlanService) {}
}
