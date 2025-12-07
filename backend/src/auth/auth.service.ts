import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TenantsService } from '../tenants/tenants.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private tenantsService: TenantsService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role, tenantId: user.tenantId };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId
            }
        };
    }

    async register(registerDto: RegisterDto) {
        // 1. Check if email exists
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new UnauthorizedException('Email already exists');
        }

        // 2. Create Tenant
        const tenant = await this.tenantsService.create({
            companyName: registerDto.companyName,
            subdomain: registerDto.subdomain,
        });

        // 3. Create User
        const user = await this.usersService.create({
            email: registerDto.email,
            password: registerDto.password,
            role: UserRole.OWNER,
            tenantId: tenant.id,
        });

        // 4. Return Login
        return this.login(user);
    }
}
