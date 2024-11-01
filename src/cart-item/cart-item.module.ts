import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartService } from 'src/cart/cart.service';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, CartService],
})
export class CartItemModule {}
