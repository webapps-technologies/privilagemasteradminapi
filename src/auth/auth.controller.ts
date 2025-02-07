import { Body, Controller, Get, Ip, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AdminSigninDto,
  BusinessCreateDto,
  BusinessLoginDto,
  ForgotPassDto,
  OtpDto,
  SigninDto,
  VerifyOtpDto,
} from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from 'src/enum';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  adminLogin(@Body() dto: AdminSigninDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/verify')
  verifyOtp(@Body() dto: VerifyOtpDto, @Ip() ip) {
    return this.authService.verifyOtp(dto, ip);
  }

  @Post('admin/resetPass')
  resetPassword(@Body() dto: ForgotPassDto) {
    return this.authService.resetPassword(dto);
  }

  @Post('create-business')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  createBusiness(@Body() dto: BusinessCreateDto) {
    return this.authService.createBusiness(dto);
  }

  @Post('business/login')
  businessLogin(@Body() dto: BusinessLoginDto) {
    return this.authService.businessLogin(dto);
  }

  @Post('business/verify')
  businessVerifyOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.businessVerifyOTP(dto);
  }

  @Post('register/business')
  registerBusiness() {}

  @Post('member/login')
  memberLogin(@Body() dto: SigninDto) {
    return this.authService.memberLogin(dto);
  }

  @Post('member/verify')
  memberVerifyOtp(@Body() dto: OtpDto) {
    return this.authService.memberVerifyOtp(dto);
  }

  @Get('logout')
  @UseGuards(AuthGuard('jwt'))
  logout(@CurrentUser() user: Account, @Ip() ip) {
    return this.authService.logout(user.id, ip);
  }
}
