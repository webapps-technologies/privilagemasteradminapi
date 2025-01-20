import {
  Body,
  Controller,
  Get,
  NotAcceptableException,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Account } from 'src/account/entities/account.entity';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { PaymentStatus, PaymentType, UserRole } from 'src/enum';
import { NotifyService } from 'src/notify/notify.service';
import { checkPaymentStatus, generateUrl } from 'src/utils/payment.util';
import { instance } from 'src/utils/razor-pay.utils';
import {
  OrderDto,
  PaginationDto,
  PayDto,
  PaymentHistoryDto,
} from './dto/payment-history.dto';
import { PaymentHistoryService } from './payment-history.service';

@Controller('payment-history')
export class PaymentHistoryController {
  constructor(
    private readonly paymentHistoryService: PaymentHistoryService,
    private readonly notifyService: NotifyService,
  ) {}

  // @Post('order')
  // @UseGuards(AuthGuard('jwt'))
  // async createOrder(@Body() dto: PaymentDto) {
  //   const options = {
  //     amount: +dto.amount * 100,
  //     currency: 'INR',
  //     receipt: dto.phoneNumber,
  //     payment_capture: '0',
  //   };

  //   const payload = await instance().orders.create(options);
  //   if (payload.status == 'created') {
  //     return payload;
  //   } else {
  //     throw new NotAcceptableException('Please Try After Some Time');
  //   }
  // }

  // For phone pay
  @Post('initiate/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async initiate(@Param('id') id: string, @CurrentUser() user: Account) {
    const payment = await this.paymentHistoryService.findOne(id);
    return generateUrl(
      user.id,
      payment.paymentId,
      payment.total * 100,
      user.phoneNumber,
      process.env.STN_CALLBACK_URL,
    );
  }

  // For razor pay
  @Post('order')
  // @UseGuards(AuthGuard('jwt'))
  async getOrder(@Body() body: OrderDto) {
    const options = {
      amount: +body.amount * 100, // amount in the smallest currency unit
      currency: 'INR',
      receipt: body.email,
      payment_capture: '0',
    };
    const payload = await instance().orders.create(options);
    if (payload.status === 'created') {
      return payload;
    } else {
      throw new NotAcceptableException(
        'Try after some time or user other payment methods!',
      );
    }
  }

  @Post('pay')
  async payDoctor(@Body() dto, @Res() res: Response) {
    const result = await checkPaymentStatus(dto.transactionId);
    if (!result.success) {
      return res.redirect(
        process.env.STN_REDIRECT_URL + '/failed/' + dto.transactionId,
      );
    } else {
      return res.redirect(
        process.env.STN_REDIRECT_URL + '/success/' + dto.transactionId,
      );
    }
  }

  @Post('phonepay/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async phonePe(
    @Param('id') id: string,
    @Body() dto: PayDto,
    @CurrentUser() user: Account,
  ) {
    const result = await checkPaymentStatus(id);
    dto.updatedId = user.id;
    dto.paymentId = result.data.transactionId;
    dto.status =
      result.success === true ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
    dto.summary = JSON.stringify(result);
    // return this.paymentHistoryService.update(id, dto);
  }

  @Post('razorpay/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.USER)
  async razorPay(@Param('id') id: string, @Body() dto: PaymentHistoryDto) {
    dto['mode'] = PaymentType.RAZOR_PAY;
    return this.paymentHistoryService.razorPay(id, dto);
  }

  @Get('admin/list/total')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAllByAdminTotal(@Query() dto: PaginationDto) {
    return this.paymentHistoryService.findTotal(dto);
  }

  @Get('all/list')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(@Query() dto: PaginationDto) {
    return this.paymentHistoryService.find(dto);
  }

  // @Get('user/list/:userId')
  // @UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
  // @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  // @CheckPermissions([PermissionAction.READ, 'payment_history'])
  // findByUser(@Query() dto: PaginationDto, @Param('userId') userId: string) {
  //   return this.paymentHistoryService.findAll(dto, userId);
  // }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.paymentHistoryService.findOne(id);
  }
}
