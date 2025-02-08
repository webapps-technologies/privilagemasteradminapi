import { PartialType } from '@nestjs/swagger';
import { CreateUserChildDto } from './create-user-child.dto';

export class UpdateUserChildDto extends PartialType(CreateUserChildDto) {}
