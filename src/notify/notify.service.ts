import { Injectable } from '@nestjs/common';
import { NotificationsService } from 'src/notifications/notifications.service';
// import { fcmMessanger } from 'src/utils/firebase-notify.utils';
import { sendSMS } from 'src/utils/sms.utils';

@Injectable()
export class NotifyService {
  constructor(private readonly notficationService: NotificationsService) {}

  userAccountApproved(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'Account Approved';
    const message = 'Your account has been approved! Welcome to our stenry.';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  userPaymentFailed(
    phoneNumber: number,
    fcm: string,
    accountId: string,
    paymentId: string,
    total: number,
  ) {
    const title = 'Payment Failed';
    const message = `Your payment of ${total} for STNERY.com Tracking ID ${paymentId} has failed.In case your money has been debited, it will be refunded within 7-10 days.`;
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    sendSMS(phoneNumber, message, 1707171929682221672);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  userAccountDisapproved(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'Account Disapproved';
    const message =
      "We're sorry, but your account application has been disapproved. Please contact support for further assistance.";
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  userAccountPending(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'Account Pending';
    const message =
      'Dear Seller, Thank you for showing interest in our Seller Panel, We will verify your account & Share you update. STNERY';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    sendSMS(phoneNumber, message, 1707171929686254455);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  vendorAccountApproved(phoneNumber: string, fcm: string, accountId: string) {
    const title = 'Vendor Account Approved';
    const message =
      'Congratulations! Your vendor account has been approved. You can now start listing your products.';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  vendorAccountDisapproved(
    phoneNumber: number,
    fcm: string,
    accountId: string,
  ) {
    const title = 'Vendor Account Disapproved';
    const message =
      "We're sorry, but your vendor account application has been disapproved. Please contact support for more details.";
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  vendorAccountPending(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'Vendor Account Pending';
    const message =
      'Your vendor account application is currently pending. We will notify you once it has been reviewed.';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  orderPlaced(
    phoneNumber: number,
    fcm: string,
    accountId: string,
    orderId: string,
  ) {
    const title = 'Order Placed';
    const message = `We thank you for shopping with us. Your Order ${orderId} is confirmed. Please check your app for further details. STNERY`;
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    sendSMS(phoneNumber, message, 1707171929652025270);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  orderDispatch(phoneNumber: number, fcm: string, accountId: string) {
    console.log(phoneNumber, fcm, accountId);
    
    const title = 'Order Dispatched';
    const days = '7-8days';
    const message = `Shipped: Your order has been shipped. It will be delivered by ${days}. STNERY`;
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    sendSMS(phoneNumber, message, 1707171929674921327);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  orderDelivered(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'Order Delivered';
    const message =
      'Your order has been delivered. We hope you enjoy your purchase!';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  orderCancelled(
    phoneNumber: number,
    fcm: string,
    accountId: string,
    name: string,
    orderId: string,
  ) {
    const title = 'Order Cancelled';
    const message = `Dear ${name}, As requested by you, your Order ${orderId} has been cancelled. Please check your APP for further details. STNERY`;
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    sendSMS(phoneNumber, message, 1707171929656281237);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }

  vendorGetOrder(phoneNumber: number, fcm: string, accountId: string) {
    const title = 'New Order Received';
    const message =
      'You have received a new order. Please check your vendor dashboard for details.';
    // Add logic to send notification using FCM with title and message
    // fcmMessanger(fcm, title, message);
    this.notficationService.create({
      title,
      desc: message,
      type: null,
      accountId,
    });
  }
}
