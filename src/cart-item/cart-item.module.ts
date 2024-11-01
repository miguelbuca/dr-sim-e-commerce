import { Module } from '@nestjs/common';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';

@Module({
  controllers: [CartItemController],
  providers: [CartItemService, CartService, ProductService],
})
export class CartItemModule {}
