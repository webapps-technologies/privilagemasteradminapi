import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { SettingDto } from './dto/setting.dto';
import { SettingsService } from './settings.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

@Controller('settings')
export class SettingsController {
  version = new Date();
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: SettingDto) {
    return this.settingsService.create(dto);
  }

  @Get()
  find() {
    return this.settingsService.find();
  }

  @Get('admin')
  findSettingByAdmin() {
    return this.settingsService.findSettingByAdmin();
  }

  @Patch('update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'setting'])
  update(@Body() dto: SettingDto) {
    return this.settingsService.update(dto);
  }
}
