import {
  Body,
  Controller,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CompanyDetailsService } from './company-details.service';
import { CompanyDetailDto } from './dto/company-detail.dto';

@Controller('company-details')
export class CompanyDetailsController {
  constructor(private readonly companyDetailsService: CompanyDetailsService) {}

  @Patch('profile-update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  update(@CurrentUser() user: Account, @Body() dto: CompanyDetailDto) {
    return this.companyDetailsService.update(user.id, dto);
  }
}
