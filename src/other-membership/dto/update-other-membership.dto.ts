import { PartialType } from '@nestjs/swagger';
import { CreateOtherMembershipDto } from './create-other-membership.dto';

export class UpdateOtherMembershipDto extends PartialType(CreateOtherMembershipDto) {}
