import { Product } from '@prisma/client';
import { IsString, IsOptional, IsInt, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductUpdateDto
  implements Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    example: 'Smartphone',
    description: 'The updated name of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'An updated description for the smartphone.',
    description: 'The updated description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 249.99,
    description: 'The updated price of the product',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The updated quantity of the product available in stock',
    required: false,
  })
  @IsInt()
  @IsOptional()
  stock: number;
}