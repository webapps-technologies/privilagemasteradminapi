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
  MaxFileSizeValidator,
  ParseFilePipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserChildService } from './user-child.service';
import {
  CreateByUserChildDto,
  CreateUserChildDto,
} from './dto/create-user-child.dto';
import { UpdateUserChildDto } from './dto/update-user-child.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from 'src/enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Account } from 'src/account/entities/account.entity';

@Controller('user-child')
export class UserChildController {
  constructor(private readonly userChildService: UserChildService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  create(@Body() dto: CreateUserChildDto) {
    const memberId = `CHD-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    dto.memberId = memberId;
    return this.userChildService.create(dto);
  }

  @Post('add-child')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  addChild(@Body() dto: CreateByUserChildDto, @CurrentUser() user: Account) {
    const memberId = `CHD-MEM-${Math.floor(1000 + Math.random() * 9000)}`;
    dto.memberId = memberId;
    dto.accountId = user.id;
    return this.userChildService.addChild(dto);
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  update(@Param('id') id: string, @Body() dto: UpdateUserChildDto) {
    return this.userChildService.update(id, dto);
  }

  @Put('profileImage/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.BUSINESS)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/UserChild/profile',
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
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 1 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    const fileData = await this.userChildService.findOne(id);
    return this.userChildService.profileImage(file.path, fileData);
  }
}
