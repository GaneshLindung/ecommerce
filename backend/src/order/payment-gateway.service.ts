import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { Order } from './order.entity';

export interface PaymentTransactionResult {
  reference: string;
  token?: string;
  redirectUrl?: string;
  status: string;
}

interface MidtransTransactionResponse {
  token?: string;
  redirect_url?: string;
  error_messages?: string[];
}

export class MidtransNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  transaction_status: string;
  fraud_status?: string;
  signature_key: string;
}

@Injectable()
export class PaymentGatewayService {
  private readonly serverKey: string;
  private readonly isProduction: boolean;

  constructor(private readonly configService: ConfigService) {
    this.serverKey =
      this.configService.get<string>('MIDTRANS_SERVER_KEY') ?? '';
    this.isProduction =
      (this.configService.get<string>('MIDTRANS_IS_PRODUCTION') ?? 'false') ===
      'true';
  }

  isConfigured(): boolean {
    return this.serverKey.length > 0;
  }

  async createEwalletTransaction(
    order: Order,
    grossAmount: number,
  ): Promise<PaymentTransactionResult> {
    if (!this.isConfigured()) {
      throw new BadRequestException(
        'Payment gateway belum dikonfigurasi. Set MIDTRANS_SERVER_KEY terlebih dahulu.',
      );
    }

    const orderReference = `ORDER-${order.id}-${Date.now()}`;
    const baseUrl = this.isProduction
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const paymentChannel = order.paymentChannel ?? 'qris';

    const payload = {
      transaction_details: {
        order_id: orderReference,
        gross_amount: Math.round(grossAmount),
      },
      customer_details: {
        first_name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      enabled_payments: [paymentChannel],
      item_details: order.items.map((item) => ({
        id: String(item.productId),
        price: Math.round(item.price),
        quantity: item.quantity,
        name: item.productName,
      })),
    };

    const authHeader = Buffer.from(`${this.serverKey}:`).toString('base64');

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${authHeader}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = (await response.json()) as MidtransTransactionResponse;

    if (!response.ok) {
      const message =
        data.error_messages?.join(', ') ?? 'Gagal membuat transaksi Midtrans';
      throw new InternalServerErrorException(message);
    }

    return {
      reference: orderReference,
      token: data.token,
      redirectUrl: data.redirect_url,
      status: 'pending_payment',
    };
  }

  validateNotificationSignature(payload: MidtransNotification): boolean {
    if (!this.isConfigured()) {
      return false;
    }

    const rawSignature = `${payload.order_id}${payload.status_code}${payload.gross_amount}${this.serverKey}`;
    const generatedSignature = createHash('sha512')
      .update(rawSignature)
      .digest('hex');

    return generatedSignature === payload.signature_key;
  }
}
