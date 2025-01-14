import { PartialType } from '@nestjs/swagger';
import { CreateLicencePlanDto } from './create-licence-plan.dto';

export class UpdateLicencePlanDto extends PartialType(CreateLicencePlanDto) {}
