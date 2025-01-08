import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PermissionAction, UserRole } from 'src/enum';
import { CompanyDetailsService } from './company-details.service';
import { CompanyDetailDto, RatingUpdateDto } from './dto/company-detail.dto';
import { DefaultStatusDto } from 'src/common/dto/default-status.dto';
import { CheckPermissions } from 'src/auth/decorators/permissions.decorator';

@Controller('company-details')
export class CompanyDetailsController {
  constructor(private readonly companyDetailsService: CompanyDetailsService) {}

  @Post('sendMail/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.CREATE, 'company_detail'])
  sendMail(@Param('accountId') accountId: string) {
    return this.companyDetailsService.sendMail(accountId);
  }

  @Patch('profile-update')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  update(@CurrentUser() user: Account, @Body() dto: CompanyDetailDto) {
    return this.companyDetailsService.update(user.id, dto);
  }

  @Patch('admin/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'company_detail'])
  updateByAdmin(
    @Param('accountId') accountId: string,
    @Body() dto: RatingUpdateDto,
  ) {
    return this.companyDetailsService.updateByAdmin(accountId, dto);
  }

  @Patch('docStatus/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'company_detail'])
  updateDocStatusByAdmin(
    @Param('accountId') accountId: string,
    @Body() dto: DefaultStatusDto,
  ) {
    return this.companyDetailsService.updateDocStatusByAdmin(accountId, dto);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/companyDetail/profile',
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
  async profileImage(
    @CurrentUser() user: Account,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.companyDetailsService.findCompany(user.id);
    return this.companyDetailsService.profileImage(file.path, fileData);
  }

  @Put('hrCompany-logo')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/companyDetail/profile',
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
  async hrLogo(
    @CurrentUser() user: Account,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.companyDetailsService.findCompany(user.id);
    return this.companyDetailsService.hrLogo(file.path, fileData);
  }
  
  @Put('logo/:accountId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(...Object.values(UserRole))
  @CheckPermissions([PermissionAction.UPDATE, 'company_detail'])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/companyDetail/profile',
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
    @Param('accountId') accountId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.companyDetailsService.findCompany(accountId);
    return this.companyDetailsService.logo(file.path, fileData);
  }
  
  @Put('document')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.RECRUITER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/companyDetail/profile',
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
  async document(
    @CurrentUser() user: Account,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(pdf|docx|jpg|jpeg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.companyDetailsService.findCompany(user.id);
    return this.companyDetailsService.document(file.path, fileData);
  }
}
