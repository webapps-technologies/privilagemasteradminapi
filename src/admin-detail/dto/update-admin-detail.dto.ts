import { PartialType } from '@nestjs/swagger';
import { CreateAdminDetailDto } from './create-admin-detail.dto';

export class UpdateAdminDetailDto extends PartialType(CreateAdminDetailDto) {}
