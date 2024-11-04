import { CartItem } from '@prisma/client';
import { IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemUpdateDto
  implements
    Omit<CartItem, 'id' | 'productId' | 'cartId' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    example: 3,
    description:
      'The new quantity of the product in the cart. If not provided, the quantity will remain unchanged.',
    required: false,
  })
  @IsInt()
  @IsOptional()
  quantity: number;
}
