import { Controller, Get, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CacheKey } from '@nestjs/cache-manager';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: "Retrieve the authenticated user's cart" })
  @CacheKey('cart')
  @ApiResponse({
    status: 200,
    description: 'The cart has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found for the user.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  async get(@GetUser() user: User) {
    return this.cartService.get(user.id);
  }
}
