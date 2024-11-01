import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}
  async get(userId: string) {
    try {
      const cart = await this.prismaService.cart.findFirst({
        where: {
          AND: {
            userId,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
      if (!cart) {
        throw new NotFoundException('Cart not found');
      }
      return cart;
    } catch {
      throw new BadRequestException('Failed to retrieve Cart');
    }
  }
}
