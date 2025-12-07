import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTenantDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsNotEmpty()
    subdomain: string;
}
