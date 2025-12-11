import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items'] });
  }

  // penting: async + cek null
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

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.customerName = dto.customerName;
    order.customerEmail = dto.customerEmail;
    order.status = 'pending';

    order.items = dto.items.map((i) => {
      const item = new OrderItem();
      item.productId = i.productId;
      item.productName = i.productName;
      item.price = i.price;
      item.quantity = i.quantity;
      return item;
    });

    return this.orderRepo.save(order);
  }
}
