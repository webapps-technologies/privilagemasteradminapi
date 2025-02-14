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
import { BusinessPageService } from './business-page.service';
import { CreateBusinessPageDto } from './dto/create-business-page.dto';
import { UpdateBusinessPageDto } from './dto/update-business-page.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';
import { CommonPaginationDto } from 'src/common/dto/common-pagination.dto';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';

@Controller('business-page')
export class BusinessPageController {
  constructor(private readonly businessPageService: BusinessPageService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateBusinessPageDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.businessPageService.create(dto, user.id);
  }

  @Get('list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  findAll(
    @Query() dto: DefaultStatusPaginationDto,
    @CurrentUser() user: Account,
  ) {
    return this.businessPageService.findAll(dto, user.id);
  }

  @Get('byUser/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  getActivePages(
    @Query() dto: CommonPaginationDto,
    @Param('accountId') accountId: string,
  ) {
    return this.businessPageService.getActivePages(dto, accountId);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS, UserRole.USER)
  findOne(@Param('id') id: string) {
    return this.businessPageService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateBusinessPageDto) {
    return this.businessPageService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.businessPageService.status(id, dto);
  }
}
