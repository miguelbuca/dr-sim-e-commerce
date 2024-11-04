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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Cart Item')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('cart-item')
export class CartItemController {
  constructor(private cartItemService: CartItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item in the cart' })
  @ApiResponse({
    status: 201,
    description: 'The cart item has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Invalid data provided.',
  })
  async create(@GetUser() user: User, @Body() body: CartItemCreateDto) {
    return this.cartItemService.create(user.id, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an item in the cart' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the cart item to update',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found.',
  })
  async update(
    @GetUser() user: User,
    @Param('id') id: string,
    @Body() body: CartItemUpdateDto,
  ) {
    return this.cartItemService.update(user.id, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an item from the cart' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the cart item to delete',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found.',
  })
  async delete(@GetUser() user: User, @Param('id') id: string) {
    return this.cartItemService.delete(user.id, id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific item from the cart' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the cart item to retrieve',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @CacheKey('cart-item')
  @ApiResponse({
    status: 200,
    description: 'The cart item has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart item not found.',
  })
  async get(@GetUser() user: User, @Param('id') id: string) {
    return this.cartItemService.get(user.id, id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all items in the cart' })
  @CacheKey('cart-items')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number to retrieve, for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The number of items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of cart items retrieved successfully.',
  })
  async getAll(@GetUser() user: User, @Query() queries) {
    return this.cartItemService.getAll(
      user.id,
      Number(queries?.page ?? 1),
      Number(queries?.limit ?? 10),
    );
  }
}