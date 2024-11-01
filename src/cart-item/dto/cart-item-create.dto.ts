import { CartItem } from '@prisma/client';
import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CartItemCreateDto
  implements Omit<CartItem, 'id' | 'cartId' | 'createdAt' | 'updatedAt'>
{
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}
