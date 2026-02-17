import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  MidtransNotification,
  PaymentGatewayService,
} from './payment-gateway.service';

export interface CreateOrderResponse {
  order: Order;
  payment?: {
    reference: string;
    status: string;
    token?: string;
    redirectUrl?: string;
  };
}

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto): Promise<CreateOrderResponse> {
    const order = new Order();
    order.customerName = dto.customerName;
    order.customerEmail = dto.customerEmail;
    order.customerPhone = dto.customerPhone;
    order.addressLine = dto.addressLine;
    order.city = dto.city;
    order.postalCode = dto.postalCode;
    order.shippingMethod = dto.shippingMethod;
    order.paymentMethod = dto.paymentMethod;
    order.paymentChannel = dto.paymentChannel;
    order.notes = dto.notes;
    order.status = 'pending';
    order.paymentStatus =
      dto.paymentMethod === 'cash' ? 'pending_manual' : 'unpaid';

    order.items = dto.items.map((i) => {
      const item = new OrderItem();
      item.productId = i.productId;
      item.productName = i.productName;
      item.price = i.price;
      item.quantity = i.quantity;
      return item;
    });

    const savedOrder = await this.orderRepo.save(order);

    if (savedOrder.paymentMethod !== 'ewallet') {
      return { order: savedOrder };
    }

    const grossAmount = savedOrder.items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0,
    );

    const transaction =
      await this.paymentGatewayService.createEwalletTransaction(
        savedOrder,
        grossAmount,
      );

    savedOrder.paymentGateway = 'midtrans';
    savedOrder.paymentReference = transaction.reference;
    savedOrder.paymentToken = transaction.token;
    savedOrder.paymentRedirectUrl = transaction.redirectUrl;
    savedOrder.paymentStatus = transaction.status;

    const updatedOrder = await this.orderRepo.save(savedOrder);

    return {
      order: updatedOrder,
      payment: {
        reference: transaction.reference,
        status: transaction.status,
        token: transaction.token,
        redirectUrl: transaction.redirectUrl,
      },
    };
  }

  async handleMidtransNotification(
    payload: MidtransNotification,
  ): Promise<Order> {
    const isValidSignature =
      this.paymentGatewayService.validateNotificationSignature(payload);
    if (!isValidSignature) {
      throw new BadRequestException('Invalid payment notification signature');
    }

    const order = await this.orderRepo.findOne({
      where: { paymentReference: payload.order_id },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException('Order with payment reference not found');
    }

    const statusMap: Record<string, string> = {
      capture: payload.fraud_status === 'challenge' ? 'challenge' : 'paid',
      settlement: 'paid',
      pending: 'pending_payment',
      deny: 'failed',
      cancel: 'cancelled',
      expire: 'expired',
      refund: 'refunded',
      partial_refund: 'partially_refunded',
    };

    const paymentStatus = statusMap[payload.transaction_status] ?? 'unknown';
    order.paymentStatus = paymentStatus;
    order.status = paymentStatus === 'paid' ? 'paid' : order.status;

    return this.orderRepo.save(order);
  }
}