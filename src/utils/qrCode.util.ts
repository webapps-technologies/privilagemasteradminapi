import * as QRCode from 'qrcode';

export async function generateQrCode(data: any) {
  try {
    const jsonString = JSON.stringify(data);
    return await QRCode.toDataURL(jsonString);
  } catch (error) {
    throw new Error('Failed to generate QR Code');
  }
}
