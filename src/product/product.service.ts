import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(dto: ProductCreateDto) {
    try {
      return await this.prismaService.product.create({
        data: {
          ...dto,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential already taken');
        }
      }
      throw new BadRequestException('Failed to create product');
    }
  }

  async update(id: string, dto: ProductUpdateDto) {
    try {
      return await this.prismaService.product.update({
        data: {
          ...dto,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }
      }
      throw new BadRequestException('Failed to update product');
    }
  }

  async delete(id: string) {
    try {
      await this.prismaService.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Product not found');
        }
      }
      throw new BadRequestException('Failed to delete product');
    }
  }

  async get(id: string) {
    try {
      const product = await this.prismaService.product.findUnique({
        where: {
          id,
        },
      });
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } catch {
      throw new BadRequestException('Failed to retrieve product');
    }
  }

  async getAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const totalItems = await this.prismaService.product.count();

      const products = await this.prismaService.product.findMany({
        skip,
        take: limit,
      });

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: products,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch {
      throw new BadRequestException('Failed to retrieve products');
    }
  }
}
