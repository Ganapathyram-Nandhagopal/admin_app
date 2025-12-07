import { IsEmail, IsString, IsNotEmpty, IsOptional, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from '../../users/entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @IsUUID()
    @IsNotEmpty()
    tenantId: string;
}
