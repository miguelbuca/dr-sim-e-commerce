import { Controller, Get, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CacheKey } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}
  @Get()
  @CacheKey('cart')
  async get(@GetUser() user: User) {
    return this.cartService.get(user.id);
  }
}
