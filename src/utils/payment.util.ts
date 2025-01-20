import { NotAcceptableException } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';

export async function generateUrl(
  userId: string,
  transactionId: string,
  amount: number,
  mobileNumber: string,
  callbackUrl: string,
) {
  try {
    const data = JSON.stringify({
      merchantId: process.env.STN_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount,
      redirectMode: process.env.STN_REDIRECT_MODE,
      mobileNumber,
      redirectUrl: callbackUrl,
      callbackUrl: callbackUrl,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    });
    const newBuffer = Buffer.from(data).toString('base64');
    const sha256Hash = createHash('sha256')
      .update(newBuffer + '/pg/v1/pay' + process.env.STN_SALT_KEY)
      .digest('hex');

    const payload = await axios.post(
      process.env.STN_GATEWAY_URL + 'pay',
      { request: newBuffer },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.STN_SALT_INDEX,
        },
      },
    );
    if (payload.data.success === true) {
      return payload.data.data.instrumentResponse.redirectInfo;
    } else {
      throw new NotAcceptableException(
        'Payment not initiated. Please contact to admin!',
      );
    }
  } catch (error) {
    // console.log(error);

    throw new NotAcceptableException(
      'Payment not initiated. Please contact to admin!',
    );
  }
}

export async function refund(
  userId: string,
  transactionId: string,
  amount: number,
  originalTransactionId: string,
) {
  try {
    const data = JSON.stringify({
      originalTransactionId,
      merchantId: process.env.STN_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: userId,
      amount,
      callbackUrl: process.env.STN_CALLBACK_URL,
    });
    const newBuffer = Buffer.from(data).toString('base64');
    const sha256Hash = createHash('sha256')
      .update(newBuffer + '/pg/v1/pay' + process.env.ZK_SALT_KEY)
      .digest('hex');

    const payload = await axios.post(
      process.env.ZK_GATEWAY_URL + 'refund',
      { request: newBuffer },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.ZK_SALT_INDEX,
        },
      },
    );
    return payload.data;
  } catch (error) {
    return error.data;
  }
}

export async function checkPaymentStatus(transactionId: string) {
  try {
    const string =
      `/pg/v1/status/${process.env.ZK_MERCHANT_ID}/${transactionId}` +
      process.env.ZK_SALT_KEY;
    const sha256Hash = createHash('sha256').update(string).digest('hex');

    const payload = await axios.get(
      `${process.env.ZK_GATEWAY_URL}status/${process.env.ZK_MERCHANT_ID}/${transactionId}`,
      {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          'X-VERIFY': sha256Hash + '###' + process.env.ZK_SALT_INDEX,
          'X-MERCHANT-ID': `${process.env.ZK_MERCHANT_ID}`,
        },
      },
    );
    return payload.data;
  } catch (error) {
    throw new NotAcceptableException(
      'Payment not initiated. Please contact to admin!',
    );
  }
}
