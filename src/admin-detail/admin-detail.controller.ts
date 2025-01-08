import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminDetailService } from './admin-detail.service';
import { CreateAdminDetailDto } from './dto/create-admin-detail.dto';
import { UpdateAdminDetailDto } from './dto/update-admin-detail.dto';

@Controller('admin-detail')
export class AdminDetailController {
  constructor(private readonly adminDetailService: AdminDetailService) {}

  @Post()
  create(@Body() createAdminDetailDto: CreateAdminDetailDto) {
    return this.adminDetailService.create(createAdminDetailDto);
  }

  @Get()
  findAll() {
    return this.adminDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminDetailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDetailDto: UpdateAdminDetailDto) {
    return this.adminDetailService.update(+id, updateAdminDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminDetailService.remove(+id);
  }
}
