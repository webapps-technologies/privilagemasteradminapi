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
import { OtherMembershipService } from './other-membership.service';
import { CreateOtherMembershipDto } from './dto/create-other-membership.dto';
import { UpdateOtherMembershipDto } from './dto/update-other-membership.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';

@Controller('other-membership')
export class OtherMembershipController {
  constructor(
    private readonly otherMembershipService: OtherMembershipService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  create(@Body() dto: CreateOtherMembershipDto, @CurrentUser() user: Account) {
    dto.accountId = user.id;
    return this.otherMembershipService.create(dto);
  }

  @Post('business/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  createByBusiness(
    @Body() dto: CreateOtherMembershipDto,
    @Param('accountId') accountId: string,
  ) {
    dto.accountId = accountId;
    return this.otherMembershipService.create(dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER, UserRole.BUSINESS)
  remove(@Param('id') id: string) {
    return this.otherMembershipService.remove(id);
  }
}
