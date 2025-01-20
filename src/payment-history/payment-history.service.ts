import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DefaultStatus,
  PaymentStatus,
  PaymentType,
} from 'src/enum';
// import { NodeMailerService } from "src/node-mailer/node-mailer.service";
// import { NotifyService } from 'src/notify/notify.service';
import { Brackets, Repository } from 'typeorm';
import {
  PaginationDto,
  PayDto,
  PaymentHistoryDto,
  PhonePayHistoryDto,
} from './dto/payment-history.dto';
import { PaymentHistory } from './entities/payment-history.entity';
import { NotifyService } from 'src/notify/notify.service';

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectRepository(PaymentHistory)
    private readonly paymentRepo: Repository<PaymentHistory>,
    private readonly notifyService: NotifyService,
    // private readonly nodeMailerService: NodeMailerService
  ) {}

  async phonePay(dto: PhonePayHistoryDto) {
    const result = await this.paymentRepo.findOne({
      where: {
        accountId: dto.accountId,
        // cartId: dto.cartId,
      },
    });
    if (result) {
      const assignObj = Object.assign(result, dto);
      return this.paymentRepo.save(assignObj);
    }
    const obj = Object.create(dto);
    return this.paymentRepo.save(obj);
  }

  async razorPay(id: string, dto: PaymentHistoryDto) {
    const check = await this.paymentRepo.findOne({
      where: {
        paymentId: dto.paymentId,
        signature: dto.signature,
        orderId: dto.orderId,
      },
    });

    if (check) {
      throw new ConflictException('Please make a new payment!');
    }
    const result = await this.paymentRepo
      .createQueryBuilder('paymentHistory')
      .leftJoinAndSelect('paymentHistory.cart', 'cart')
      .leftJoinAndSelect('cart.account', 'account')
      .leftJoinAndSelect('cart.coupan', 'coupan')
      .leftJoinAndSelect('account.userDetail', 'userDetail')
      .leftJoinAndSelect(
        'account.userAddress',
        'userAddress',
        'userAddress.status = :addStatus',
        { addStatus: DefaultStatus.ACTIVE },
      )
      .leftJoinAndSelect('cart.cartProduct', 'cartProduct')
      .leftJoinAndSelect('cartProduct.product', 'product')
      .leftJoinAndSelect('product.productCategory', 'productCategory')
      .leftJoinAndSelect('productCategory.category', 'category')
      .leftJoinAndSelect('cartProduct.cartProductVariant', 'cartProductVariant')
      .leftJoinAndSelect('cartProductVariant.productVariant', 'productVariant')
      .leftJoinAndSelect(
        'cartProductVariant.productBulkOffer',
        'productBulkOffer',
      )
      .select([
        'paymentHistory.id',
        'paymentHistory.total',
        'paymentHistory.status',

        'cart.id',
        'cart.totalVendor',
        'cart.invoiceNumber',
        'cart.total',
        'cart.orderId',
        'cart.accountId',

        'coupan.discountAmount',

        'account.id',
        'account.totalCoin',
        'account.usedCoin',
        'account.phoneNumber',
        'account.fcm',

        'userDetail.name',

        'userAddress.id',
        'userAddress.name',
        'userAddress.altPhone',
        'userAddress.phone',

        'product.id',
        'product.mrp',
        'product.discount',
        'product.discountedPrice',
        'product.discountType',
        'product.accountId',
        'product.finalPrice',
        'product.shippingCost',

        'productCategory.id',
        'category.commission',

        'cartProduct.id',
        'cartProduct.quantity',
        'cartProduct.type',
        'cartProductVariant.id',

        'productVariant.id',
        'productVariant.colour',
        'productVariant.size',
        'productVariant.price',
        'productVariant.discountedPrice',
        'productVariant.finalPrice',
        'productVariant.quantity',

        'productBulkOffer.id',
        'productBulkOffer.quantity',
        'productBulkOffer.price',
        'productBulkOffer.discount',
        'productBulkOffer.discountedPrice',
        'productBulkOffer.finalPrice',
        'productBulkOffer.pricePerPiece',
      ])
      .where('paymentHistory.id = :id', {
        id,
      })
      .getOne();
    if (!result) {
      throw new NotFoundException(
        'Order not found! Please make a new payment!',
      );
    }
    if (result.status === PaymentStatus.COMPLETED) {
      throw new ConflictException('Payment already done!');
    }
    // console.log(result);
    // if (dto.status === PaymentStatus.COMPLETED) {
    //   this.updateCartStatus(result.cart.id, CartStatus.ORDERED);
    //   const vendors = [];

    //   // console.log(result.total)
    //   this.walletService.afterPurchaseCoin({
    //     accountId: result.cart.accountId,
    //     coins: result.total / 100,
    //     cartId: result.id,
    //   });

    //   result.cart.cartProduct.forEach((element) => {
    //     const commission =
    //       element.product['productCategory'][0].category.commission / 100;
    //     // console.log(commission);
    //     const existingVendorIndex = vendors.findIndex(
    //       (item) => item.accountId === element.product['accountId'],
    //     );

    //     if (existingVendorIndex !== -1) {
    //       // Vendor exists, update vendor information
    //       const vendor = vendors[existingVendorIndex];

    //       vendor.vendorShippingCost +=
    //         element.product['shippingCost'] * element.quantity;

    //       if (element.type === CartType.PRODUCT) {
    //         vendor.vendorTotal +=
    //           element.product['finalPrice'] * element.quantity;
    //       } else if (element.type === CartType.VARIANT) {
    //         element.cartProductVariant.forEach((cartProductVariant) => {
    //           vendor.vendorTotal +=
    //             cartProductVariant.productVariant.finalPrice * element.quantity;
    //         });
    //       } else if (element.type === CartType.BULK) {
    //         element.cartProductVariant.forEach((cartProductVariant) => {
    //           vendor.vendorTotal +=
    //             cartProductVariant.productBulkOffer.finalPrice *
    //             element.quantity;
    //         });
    //       }

    //       // Update admin commission and coupon amount
    //       vendor.adminCommission += vendor.vendorTotal * commission;

    //       // Update vendor in the vendors array
    //       vendors[existingVendorIndex] = vendor;
    //     } else {
    //       // Vendor doesn't exist, create new vendor object
    //       let vendorTotal = 0;
    //       let vendorShippingCost =
    //         element.product['shippingCost'] * element.quantity;

    //       if (element.type === CartType.PRODUCT) {
    //         vendorTotal += element.product['finalPrice'] * element.quantity;
    //       } else if (element.type === CartType.VARIANT) {
    //         element.cartProductVariant.forEach((cartProductVariant) => {
    //           vendorTotal +=
    //             cartProductVariant.productVariant.finalPrice * element.quantity;
    //         });
    //       } else if (element.type === CartType.BULK) {
    //         element.cartProductVariant.forEach((cartProductVariant) => {
    //           vendorTotal +=
    //             cartProductVariant.productBulkOffer.finalPrice *
    //             element.quantity;
    //         });
    //       }

    //       // Create new vendor object
    //       const newVendor = {
    //         accountId: element.product['accountId'],
    //         vendorTotal,
    //         vendorShippingCost,
    //         adminCommission: vendorTotal * commission,
    //       };

    //       // Add new vendor to the vendors array
    //       vendors.push(newVendor);
    //     }
    //   });
    //   let coupanAmount = 0;
    //   if (result.cart.coupan) {
    //     coupanAmount =
    //       result.cart.coupan['discountAmount'] / result.cart.totalVendor;
    //   }
    //   vendors.forEach((element) => {
    //     element.vendorTotal;
    //     element.vendorShippingCost;
    //     element.adminCommission;
    //     element['paymentId'] = result.id;
    //     element['status'] = VendorWalletStatus.SUCCESS;
    //     element['type'] = WalletType.DEPOSIT;
    //     element['coupanAmount'] = coupanAmount / result.cart.totalVendor;
    //     element['amount'] =
    //       element.vendorTotal - coupanAmount + element.vendorShippingCost;
    //     this.vendorWalletsService.create(element);
    //   });
    //   this.notifyService.orderPlaced(
    //     result.cart.account['phoneNumber'],
    //     result.cart.account['fcm'],
    //     result.cart.account['id'],
    //     // result.cart.account['userDetail'][0]['firstName'],
    //     result.cart.orderId,
    //   );
    // } else {
    //   this.updateCartStatus(result.cart.id, CartStatus.PAYMENT_PENDING);
    // }
    // delete result.cart;
    const obj = Object.assign(result, dto);
    return this.paymentRepo.save(obj);
  }

  // async update(id: string, dto: PayDto) {
  //   const result = await this.paymentRepo
  //     .createQueryBuilder('paymentHistory')
  //     .leftJoinAndSelect('paymentHistory.cart', 'cart')
  //     .leftJoinAndSelect('cart.account', 'account')
  //     .leftJoinAndSelect('cart.coupan', 'coupan')
  //     .leftJoinAndSelect('account.userDetail', 'userDetail')
  //     .leftJoinAndSelect(
  //       'account.userAddress',
  //       'userAddress',
  //       'userAddress.status = :addStatus',
  //       { addStatus: DefaultStatus.ACTIVE },
  //     )
  //     .leftJoinAndSelect('cart.cartProduct', 'cartProduct')
  //     .leftJoinAndSelect('cartProduct.product', 'product')
  //     .leftJoinAndSelect('product.productCategory', 'productCategory')
  //     .leftJoinAndSelect('productCategory.category', 'category')
  //     .leftJoinAndSelect('cartProduct.cartProductVariant', 'cartProductVariant')
  //     .leftJoinAndSelect('cartProductVariant.productVariant', 'productVariant')
  //     .leftJoinAndSelect(
  //       'cartProductVariant.productBulkOffer',
  //       'productBulkOffer',
  //     )
  //     .select([
  //       'paymentHistory.id',
  //       'paymentHistory.total',
  //       'paymentHistory.status',

  //       'cart.id',
  //       'cart.totalVendor',
  //       'cart.invoiceNumber',
  //       'cart.total',
  //       'cart.orderId',
  //       'cart.accountId',

  //       'coupan.discountAmount',

  //       'account.id',
  //       'account.totalCoin',
  //       'account.usedCoin',
  //       'account.phoneNumber',
  //       'account.fcm',

  //       'userDetail.name',

  //       'userAddress.id',
  //       'userAddress.name',
  //       'userAddress.altPhone',
  //       'userAddress.phone',

  //       'product.id',
  //       'product.mrp',
  //       'product.discount',
  //       'product.discountedPrice',
  //       'product.discountType',
  //       'product.accountId',
  //       'product.finalPrice',
  //       'product.shippingCost',

  //       'productCategory.id',
  //       'category.commission',

  //       'cartProduct.id',
  //       'cartProduct.quantity',
  //       'cartProduct.type',
  //       'cartProductVariant.id',

  //       'productVariant.id',
  //       'productVariant.colour',
  //       'productVariant.size',
  //       'productVariant.price',
  //       'productVariant.discountedPrice',
  //       'productVariant.finalPrice',
  //       'productVariant.quantity',

  //       'productBulkOffer.id',
  //       'productBulkOffer.quantity',
  //       'productBulkOffer.price',
  //       'productBulkOffer.discount',
  //       'productBulkOffer.discountedPrice',
  //       'productBulkOffer.finalPrice',
  //       'productBulkOffer.pricePerPiece',
  //     ])
  //     .where('paymentHistory.paymentId = :id', {
  //       id,
  //     })
  //     .getOne();
  //   if (!result) {
  //     throw new NotFoundException(
  //       'Order not found. Try after some time or contact to admin!',
  //     );
  //   }
  //   if (result.status === PaymentStatus.COMPLETED) {
  //     throw new ConflictException('Payment already done!');
  //   }
  //   if (dto.status === PaymentStatus.COMPLETED) {
  //     this.updateCartStatus(result.cart.id, CartStatus.ORDERED);
  //     const vendors = [];

  //     this.walletService.create({
  //       accountId: result.cart.account['id'],
  //     });

  //     this.walletService.afterPurchaseCoin({
  //       accountId: result.cart.accountId,
  //       coins: result.total / 100,
  //       cartId: result.id,
  //     });

  //     result.cart.cartProduct.forEach((element) => {
  //       const commission =
  //         element.product['productCategory'][0].category.commission / 100;
  //       const existingVendorIndex = vendors.findIndex(
  //         (item) => item.accountId === element.product['accountId'],
  //       );

  //       if (existingVendorIndex !== -1) {
  //         // Vendor exists, update vendor information
  //         const vendor = vendors[existingVendorIndex];

  //         vendor.vendorShippingCost +=
  //           element.product['shippingCost'] * element.quantity;

  //         if (element.type === CartType.PRODUCT) {
  //           vendor.vendorTotal +=
  //             element.product['finalPrice'] * element.quantity;
  //         } else if (element.type === CartType.VARIANT) {
  //           element.cartProductVariant.forEach((cartProductVariant) => {
  //             vendor.vendorTotal +=
  //               cartProductVariant.productVariant.finalPrice * element.quantity;
  //           });
  //         } else if (element.type === CartType.BULK) {
  //           element.cartProductVariant.forEach((cartProductVariant) => {
  //             vendor.vendorTotal +=
  //               cartProductVariant.productBulkOffer.finalPrice *
  //               element.quantity;
  //           });
  //         }

  //         // Update admin commission and coupon amount
  //         vendor.adminCommission += vendor.vendorTotal * commission;

  //         // Update vendor in the vendors array
  //         vendors[existingVendorIndex] = vendor;
  //       } else {
  //         // Vendor doesn't exist, create new vendor object
  //         let vendorTotal = 0;
  //         let vendorShippingCost =
  //           element.product['shippingCost'] * element.quantity;

  //         if (element.type === CartType.PRODUCT) {
  //           vendorTotal += element.product['finalPrice'] * element.quantity;
  //         } else if (element.type === CartType.VARIANT) {
  //           element.cartProductVariant.forEach((cartProductVariant) => {
  //             vendorTotal +=
  //               cartProductVariant.productVariant.finalPrice * element.quantity;
  //           });
  //         } else if (element.type === CartType.BULK) {
  //           element.cartProductVariant.forEach((cartProductVariant) => {
  //             vendorTotal +=
  //               cartProductVariant.productBulkOffer.finalPrice *
  //               element.quantity;
  //           });
  //         }

  //         // Create new vendor object
  //         const newVendor = {
  //           accountId: element.product['accountId'],
  //           vendorTotal,
  //           vendorShippingCost,
  //           adminCommission: vendorTotal * commission,
  //         };

  //         // Add new vendor to the vendors array
  //         vendors.push(newVendor);
  //       }
  //     });

  //     let coupanAmount = 0;
  //     if (result.cart.coupan) {
  //       coupanAmount =
  //         result.cart.coupan['discountAmount'] / result.cart.totalVendor;
  //     }
  //     vendors.forEach((element) => {
  //       element.vendorTotal;
  //       element.vendorShippingCost;
  //       element.adminCommission;
  //       element['paymentId'] = result.id;
  //       // element['status'] = VendorWalletStatus.SUCCESS;
  //       // element['type'] = WalletType.DEPOSIT;
  //       element['coupanAmount'] = coupanAmount / result.cart.totalVendor;
  //       element['amount'] =
  //         element.vendorTotal - coupanAmount + element.vendorShippingCost;
  //       // this.vendorWalletsService.create(element);
  //     });
  //     this.notifyService.orderPlaced(
  //       result.cart.account['phoneNumber'],
  //       result.cart.account['fcm'],
  //       result.cart.account['id'],
  //       // result.cart.account['userDetail'][0]['firstName'],
  //       result.cart.orderId,
  //     );
  //   } else {
  //     // this.updateCartStatus(result.cart.id, CartStatus.PAYMENT_PENDING);
  //   }
  //   delete result.cart;
  //   const obj = Object.assign(result, dto);
  //   return this.paymentRepo.save(obj);
  // }

  async updateCOD(id: string) {
    const result = await this.paymentRepo.findOne({
      // where: { cartId: id },
    });
    if (!result) {
      throw new NotFoundException('Order not found. Try after some time!');
    }
    const obj = Object.assign(result, { status: PaymentStatus.COMPLETED });
    return this.paymentRepo.save(obj);
  }

  // async updateCancelled(id: string, status: PaymentStatus) {
  //   const result = await this.paymentRepo.findOne({
  //     where: { cartId: id },
  //   });
  //   if (!result) {
  //     throw new NotFoundException('Order not found. Try after some time!');
  //   }
  //   const obj = Object.assign(result, { status });
  //   return this.paymentRepo.save(obj);
  // }

  // async updateCartStatus(cartId: string, status: CartStatus) {
  //   this.cartProductRepo
  //     .createQueryBuilder()
  //     .update()
  //     .set({
  //       status: status,
  //     })
  //     .where('cartId = :cartId', { cartId: cartId })
  //     .execute();
  //   this.cartRepo
  //     .createQueryBuilder()
  //     .update()
  //     .set({
  //       status: status,
  //     })
  //     .where('id = :id', { id: cartId })
  //     .execute();
  // }

  async findAll(dto: PaginationDto, accountId: string) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const [result, total] = await this.paymentRepo
      .createQueryBuilder('paymentHistory')
      .leftJoinAndSelect('paymentHistory.account', 'account')
      .where(
        'paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate AND paymentHistory.accountId = :accountId',
        {
          fromDate: fromDate,
          toDate: toDate,
          accountId: accountId,
        },
      )
      .skip(dto.offset)
      .take(dto.limit)
      .orderBy({ 'paymentHistory.createdAt': 'DESC' })
      .getManyAndCount();
    return { result, total };
  }

  async find(dto: PaginationDto) {
    const keyword = dto.keyword || '';
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);

    const [result, total] = await this.paymentRepo
      .createQueryBuilder('paymentHistory')
      .leftJoinAndSelect('paymentHistory.account', 'account')
      .where(
        'paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate AND paymentHistory.status = :status AND paymentHistory.mode IN (:...type)',
        {
          fromDate: fromDate,
          toDate: toDate,
          status: dto.status,
          // type:
          //   dto.type === PaymentType.ALL
          //     ? [PaymentType.PHONE_PE]
          //     : [dto.type],
        },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'account.phoneNumber LIKE :phoneNumber OR paymentHistory.invoiceNumber LIKE :invoiceNumber OR paymentHistory.orderId LIKE :orderId',
            {
              phoneNumber: '%' + keyword + '%',
              invoiceNumber: '%' + keyword + '%',
              orderId: '%' + keyword + '%',
            },
          );
        }),
      )
      .skip(dto.offset)
      .take(dto.limit)
      .orderBy({ 'paymentHistory.createdAt': 'DESC' })
      .getManyAndCount();
    return { result, total };
  }

  async findOne(id: string) {
    const result = await this.paymentRepo
      .createQueryBuilder('paymentHistory')
      .leftJoinAndSelect('paymentHistory.cart', 'cart')
      .leftJoinAndSelect('cart.coupan', 'coupan')
      .leftJoinAndSelect('cart.userAddress', 'userAddress')
      .leftJoinAndSelect('cart.cartProduct', 'cartProduct')
      .leftJoinAndSelect('cartProduct.product', 'product')
      .leftJoinAndSelect('cartProduct.cartProductVariant', 'cartProductVariant')
      .leftJoinAndSelect('cartProductVariant.productVariant', 'productVariant')
      .leftJoinAndSelect(
        'cartProductVariant.productBulkOffer',
        'productBulkOffer',
      )
      .where('paymentHistory.id = :id', {
        id: id,
      })
      .getOne();

    if (!result) {
      throw new NotFoundException('Not found!');
    }
    return result;
  }

  async findTotal(dto: PaginationDto) {
    const fromDate = new Date(dto.fromDate);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(dto.toDate);
    toDate.setHours(23, 59, 59, 59);
    const total = await this.paymentRepo
      .createQueryBuilder('paymentHistory')
      .select([
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :PENDING THEN paymentHistory.total ELSE 0 END), 0) AS pendingTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :COMPLETED THEN paymentHistory.total ELSE 0 END), 0) AS completedTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :FAILED THEN paymentHistory.total ELSE 0 END), 0) AS failedTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :CANCELLED THEN paymentHistory.total ELSE 0 END), 0) AS cancelledTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :PENDING THEN paymentHistory.wallet ELSE 0 END), 0) AS pendingWalletTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :COMPLETED THEN paymentHistory.wallet ELSE 0 END), 0) AS completedWalletTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :FAILED THEN paymentHistory.wallet ELSE 0 END), 0) AS failedWalletTotal',
        'COALESCE(SUM(CASE WHEN paymentHistory.status = :CANCELLED THEN paymentHistory.wallet ELSE 0 END), 0) AS cancelledWalletTotal',
      ])
      .where(
        'paymentHistory.createdAt >= :fromDate AND paymentHistory.createdAt <= :toDate',
        {
          fromDate: fromDate,
          toDate: toDate,
        },
      )
      .setParameters({
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED',
        FAILED: 'FAILED',
        CANCELLED: 'CANCELLED',
      })
      .groupBy('paymentHistory.status')
      .getRawOne();
    if (total) {
      return total;
    } else {
      return {
        pendingTotal: 0,
        completedTotal: 0,
        failedTotal: 0,
        cancelledTotal: 0,
        pendingWalletTotal: 0,
        completedWalletTotal: 0,
        failedWalletTotal: 0,
        cancelledWalletTotal: 0,
      };
    }
  }
}
