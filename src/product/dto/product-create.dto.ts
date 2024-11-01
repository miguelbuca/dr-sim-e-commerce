import { Product } from '@prisma/client';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductCreateDto
  implements Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  stock: number;
}
