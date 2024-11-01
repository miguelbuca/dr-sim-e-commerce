import { Product } from '@prisma/client';
import { IsString, IsOptional, IsDecimal, IsInt } from 'class-validator';

export class ProductUpdateDto
  implements Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDecimal()
  @IsOptional()
  price: number;

  @IsInt()
  @IsOptional()
  stock: number;
}
