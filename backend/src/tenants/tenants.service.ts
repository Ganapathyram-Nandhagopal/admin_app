import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { Tenant } from './entities/tenant.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
  ) { }

  create(createTenantDto: CreateTenantDto) {
    const tenant = this.tenantsRepository.create(createTenantDto);
    return this.tenantsRepository.save(tenant);
  }

  findAll() {
    return this.tenantsRepository.find();
  }

  findOne(id: string) {
    return this.tenantsRepository.findOne({ where: { id } });
  }

  update(id: string, updateTenantDto: UpdateTenantDto) {
    return this.tenantsRepository.update(id, updateTenantDto);
  }

  remove(id: string) {
    return this.tenantsRepository.delete(id);
  }
}
