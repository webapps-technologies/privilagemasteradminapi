import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { MenusService } from 'src/menus/menus.service';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserPermissionsService } from 'src/user-permissions/user-permissions.service';
import { AccountService } from './account.service';
import {
  CreateAccountDto,
  EmailUpdateDto,
  UpdateStaffDto,
  UpdateStaffPasswordDto,
} from './dto/account.dto';
import { Account } from './entities/account.entity';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { DefaultStatusPaginationDto } from 'src/common/dto/default-status-pagination.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly menuService: MenusService,
    private readonly permissionService: PermissionsService,
    private readonly userPermService: UserPermissionsService,
  ) {}

  @Get('perms/:accountId')
  async createPerms(@Param('accountId') accountId: string) {
    const menus = await this.menuService.findAll();
    const perms = await this.permissionService.findAll();

    const obj = [];
    menus.forEach((menu) => {
      perms.forEach((perm) => {
        obj.push({
          accountId: accountId,
          menuId: menu.id,
          permissionId: perm.id,
          status: true,
        });
      });
    });
    this.userPermService.create(obj);
    return 'Done';
  }

  @Post('add-staff')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(UserRole.ADMIN)
  @CheckPermissions([PermissionAction.CREATE, 'account'])
  async create(@Body() dto: CreateAccountDto, @CurrentUser() user: Account) {
    const account = await this.accountService.create(dto, user.id);
    const menus = await this.menuService.findAll();
    const perms = await this.permissionService.findAll();
    const obj = [];
    menus.forEach((menu) => {
      perms.forEach((perm) => {
        obj.push({
          accountId: account.id,
          menuId: menu.id,
          permissionId: perm.id,
        });
      });
    });
    await this.userPermService.create(obj);
    return account;
  }

  @Get('stafflist')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'account'])
  async getStaffDetails(@Query() dto: DefaultStatusPaginationDto) {
    return this.accountService.getStaffDetails(dto);
  }

  @Get('staff/profile/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.READ, 'account'])
  async getStaffProfile(@Param('accountId') accountId: string) {
    return this.accountService.getStaffProfile(accountId);
  }

  @Get('email/otp')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  updateEmail(@Body() dto: EmailUpdateDto, @CurrentUser() user: Account) {
    return this.accountService.updateEmail(dto, user.id);
  }

  @Patch()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  resetEmail(@Body() dto: EmailUpdateDto, @CurrentUser() user: Account) {
    return this.accountService.resetEmail(dto, user.id);
  }

  @Put('status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'account'])
  recruiterStatus(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.accountService.recruiterStatus(id, dto);
  }

  @Patch('update/staff/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'account'])
  updateStaff(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateStaffDto,
  ) {
    return this.accountService.updateStaff(accountId, dto);
  }

  @Patch('staff/password/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'account'])
  updateStaffPassword(
    @Param('accountId') accountId: string,
    @Body() dto: UpdateStaffPasswordDto,
  ) {
    return this.accountService.updateStaffPassword(accountId, dto);
  }

  @Put('staff/status/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'account'])
  staffStatus(@Param('id') id: string, @Body() dto: DefaultStatusDto) {
    return this.accountService.staffStatus(id, dto);
  }
}
