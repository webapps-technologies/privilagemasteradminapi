import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
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

  @Put('logo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'setting'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/settings',
        filename: (req, file, callback) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return callback(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async logo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.settingsService.findSetting();
    return this.settingsService.logo(file.path, fileData);
  }
}
