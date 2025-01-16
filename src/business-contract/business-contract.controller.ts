import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BusinessContractService } from './business-contract.service';
import { CreateBusinessContractDto } from './dto/create-business-contract.dto';
import { UpdateBusinessContractDto } from './dto/update-business-contract.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';

@Controller('business-contract')
export class BusinessContractController {
  constructor(
    private readonly businessContractService: BusinessContractService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateBusinessContractDto) {
    return this.businessContractService.create(dto);
  }
}
