import { CartItem } from '@prisma/client';
import { IsOptional, IsInt, IsUUID } from 'class-validator';

export class CartItemUpdateDto
  implements
    Omit<CartItem, 'id' | 'productId' | 'cartId' | 'createdAt' | 'updatedAt'>
{
  @IsInt()
  @IsOptional()
  quantity: number;
}
