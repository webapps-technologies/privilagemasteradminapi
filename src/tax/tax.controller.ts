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
} from '@nestjs/common';
import { TaxService } from './tax.service';
import { CreateTaxDto } from './dto/create-tax.dto';
import { UpdateTaxDto } from './dto/update-tax.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateTaxDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.taxService.create(dto, user.id);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  findAll(@Query() dto: DefaultStatusPaginationDto, @CurrentUser() user: Account) {
    return this.taxService.findAll(dto, user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taxService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateTaxDto) {
    return this.taxService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taxService.remove(+id);
  }
}
