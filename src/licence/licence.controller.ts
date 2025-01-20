import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { LicenceService } from './licence.service';
import {
  CreateLicenceDto,
  LicencePaginationDto,
} from './dto/create-licence.dto';
import { UpdateLicenceDto } from './dto/update-licence.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { query, Response } from 'express';
import { createLicencepdf } from 'src/utils/createTable.utils';

@Controller('licence')
export class LicenceController {
  constructor(private readonly licenceService: LicenceService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateLicenceDto) {
    return this.licenceService.create(dto);
  }

  @Get('list/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() dto: LicencePaginationDto) {
    return this.licenceService.findAll(dto);
  }

  @Get('detail/:businessId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findLicenece(@Param('businessId') businessId: string) {
    return this.licenceService.findLicenece(businessId);
  }

  @Get('admin/licence-csv')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async downloadBusinessCSV(
    @Query() dto: LicencePaginationDto,
    @Res() res: Response,
  ) {
    const csvFile = await this.licenceService.downloadLicenceCsv(dto);

    res.header('Content-Type', 'text/csv');
    res.attachment('licence-list.csv');
    res.send(csvFile);
  }

  @Get('licence-list/pdf')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  async pdf(@Res() res: Response, @Query() dto: LicencePaginationDto) {
    const payload = await this.licenceService.pdf(dto);

    const pdf = await createLicencepdf(payload);
    const name = Date.now().toString() + '-licence_list.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.set('Content-Disposition', `attachment; filename="${name}"`);
    pdf.pipe(res);
    pdf.end();
  }

  @Patch('renewal/:id/:planId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  renewal(@Param('id') id: string, @Param('planId') planId: string) {
    return this.licenceService.renewal(id, planId);
  }

  @Patch('edit/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateLicenceDto) {
    return this.licenceService.update(id, dto);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  status(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.licenceService.status(id, dto);
  }
}
