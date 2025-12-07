import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsUrl } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    @Min(0)
    price: number;

    @IsNumber()
    @Min(0)
    stock: number;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsString()
    @IsOptional()
    sku?: string;
}
