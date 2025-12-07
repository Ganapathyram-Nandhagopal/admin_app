import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) { }

  create(createProductDto: CreateProductDto, tenantId: string) {
    const product = this.productsRepository.create({
      ...createProductDto,
      tenantId,
    });
    return this.productsRepository.save(product);
  }

  findAll(tenantId: string) {
    return this.productsRepository.find({ where: { tenantId } });
  }

  async findOne(id: string, tenantId: string) {
    const product = await this.productsRepository.findOne({ where: { id, tenantId } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    return this.productsRepository.remove(product);
  }
}
