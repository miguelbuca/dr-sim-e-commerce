import { Product } from '@prisma/client';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCreateDto
  implements Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    example: 'Smartphone',
    description: 'The name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'A high-quality smartphone with excellent features.',
    description: 'A brief description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 299.99,
    description: 'The price of the product',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 50,
    description: 'The quantity of the product available in stock',
  })
  @IsInt()
  @IsNotEmpty()
  stock: number;
}
