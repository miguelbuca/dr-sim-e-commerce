import { CartItem } from '@prisma/client';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemCreateDto
  implements Omit<CartItem, 'id' | 'cartId' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    description: 'The unique identifier of the product to add to the cart',
  })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product to add to the cart',
  })
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
