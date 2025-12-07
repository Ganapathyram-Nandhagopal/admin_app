import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private productsService: ProductsService,
  ) { }

  async create(createOrderDto: CreateOrderDto, tenantId: string) {
    const orderItems: OrderItem[] = [];
    let totalAmount = 0;

    for (const itemDto of createOrderDto.items) {
      const product = await this.productsService.findOne(itemDto.productId, tenantId);

      if (product.stock < itemDto.quantity) {
        throw new BadRequestException(`Product ${product.name} is out of stock`);
      }

      // Update stock (Simple decrement, real world needs transaction)
      await this.productsService.update(product.id, { stock: product.stock - itemDto.quantity }, tenantId);

      const orderItem = new OrderItem();
      orderItem.product = product;
      orderItem.quantity = itemDto.quantity;
      orderItem.price = product.price; // Snapshot price

      orderItems.push(orderItem);
      totalAmount += Number(product.price) * itemDto.quantity;
    }

    const order = this.ordersRepository.create({
      tenantId,
      customerName: createOrderDto.customerName,
      customerEmail: createOrderDto.customerEmail,
      status: OrderStatus.PENDING,
      items: orderItems,
      totalAmount,
    });

    return this.ordersRepository.save(order);
  }

  findAll(tenantId: string) {
    return this.ordersRepository.find({
      where: { tenantId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string, tenantId: string) {
    const order = await this.ordersRepository.findOne({
      where: { id, tenantId },
      relations: ['items', 'items.product']
    });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, tenantId: string) {
    const order = await this.findOne(id, tenantId);
    /* Only allow status updates and simple fields for now */
    if (updateOrderDto.status) order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }

  async remove(id: string, tenantId: string) {
    const order = await this.findOne(id, tenantId);
    return this.ordersRepository.remove(order);
  }
}
