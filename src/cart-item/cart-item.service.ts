import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CartItemCreateDto, CartItemUpdateDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CartService } from 'src/cart/cart.service';

@Injectable()
export class CartItemService {
  constructor(
    private prismaService: PrismaService,
    private cartService: CartService,
  ) {}
  async create(userId: string, { productId, ...dto }: CartItemCreateDto) {
    try {
      const cart = await this.cartService.get(userId);

      return await this.prismaService.cartItem.create({
        data: {
          ...dto,
          product: {
            connect: {
              id: productId,
            },
          },
          cart: {
            connect: {
              id: cart.id,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential already taken');
        }
      }
      throw new BadRequestException('Failed to create item');
    }
  }

  async update(userId: string, id: string, dto: CartItemUpdateDto) {
    try {
      return await this.prismaService.cartItem.update({
        data: {
          ...dto,
        },
        where: {
          id,
          AND: {
            cart: {
              userId,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Item not found');
        }
      }
      throw new BadRequestException('Failed to update item');
    }
  }

  async delete(userId: string, id: string) {
    try {
      return await this.prismaService.cartItem.delete({
        where: {
          id,
          AND: {
            cart: {
              userId,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Item not found');
        }
      }
      throw new BadRequestException('Failed to delete CartItem');
    }
  }

  async get(userId: string, id: string) {
    try {
      const CartItem = await this.prismaService.cartItem.findUnique({
        where: {
          id,
          cart: {
            AND: {
              userId,
            },
          },
        },
      });
      if (!CartItem) {
        throw new NotFoundException('Item not found');
      }
      return CartItem;
    } catch {
      throw new BadRequestException('Failed to retrieve item');
    }
  }

  async getAll(userId: string, page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const totalItems = await this.prismaService.cartItem.count();

      const CartItems = await this.prismaService.cartItem.findMany({
        where: {
          cart: {
            userId,
          },
        },
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(totalItems / limit);

      return {
        CartItems,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve items');
    }
  }
}