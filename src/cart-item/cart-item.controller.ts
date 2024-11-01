import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CartItemCreateDto, CartItemUpdateDto } from './dto';
import { CartItemService } from './cart-item.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { CacheKey } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('cart-item')
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}
  @Post()
  async create(@GetUser() user: User, @Body() body: CartItemCreateDto) {
    return this.cartItemService.create(user.id, body);
  }
  @Patch(':id')
  async update(
    @GetUser() user: User,
    @Param('id') id,
    @Body() body: CartItemUpdateDto,
  ) {
    return this.cartItemService.update(user.id, id, body);
  }
  @Delete(':id')
  async delete(@GetUser() user: User, @Param('id') id) {
    return this.cartItemService.delete(user.id, id);
  }
  @Get(':id')
  @CacheKey('cart-item')
  async get(@GetUser() user: User, @Param('id') id) {
    return this.cartItemService.get(user.id, id);
  }
  @Get()
  @CacheKey('cart-items')
  async getAll(@GetUser() user: User, @Query() queries) {
    return this.cartItemService.getAll(
      user.id,
      Number(queries?.page ?? 1),
      Number(queries?.limit ?? 10),
    );
  }
}
