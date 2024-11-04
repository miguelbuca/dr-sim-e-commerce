import { Test, TestingModule } from '@nestjs/testing';
import { CartItemService } from './cart-item.service';
import { CartService } from 'src/cart/cart.service';
import { ProductService } from 'src/product/product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

import { cartItemSharedDataMocks } from 'src/cart-item/__mocks__';
import { cartSharedDataMocks } from 'src/cart/__mocks__';
import { productSharedDataMocks } from 'src/product/__mocks__';
import { global as authGlobalMocks } from 'src/auth/__mocks__';

describe('CartItemService', () => {
  let service: CartItemService;
  let prismaService: PrismaService;
  let cartService: CartService;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartItemService,
        {
          provide: PrismaService,
          useValue: {
            cartItem: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
        {
          provide: CartService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CartItemService>(CartItemService);
    prismaService = module.get<PrismaService>(PrismaService);
    cartService = module.get<CartService>(CartService);
    productService = module.get<ProductService>(ProductService);
  });

  describe('create', () => {
    it('should create a cart item successfully', async () => {
      jest
        .spyOn(cartService, 'get')
        .mockResolvedValue(cartSharedDataMocks.cart);
      jest
        .spyOn(productService, 'get')
        .mockResolvedValue(productSharedDataMocks.product);
      jest
        .spyOn(prismaService.cartItem, 'create')
        .mockResolvedValue(cartItemSharedDataMocks.item);

      const result = await service.create(
        authGlobalMocks.user.id,
        cartItemSharedDataMocks.item,
      );

      expect(result).toEqual(cartItemSharedDataMocks.item);
      expect(cartService.get).toHaveBeenCalledWith(authGlobalMocks.user.id);
      expect(productService.get).toHaveBeenCalledWith(
        productSharedDataMocks.product.id,
      );
      expect(prismaService.cartItem.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException if stock is insufficient', async () => {
      jest
        .spyOn(cartService, 'get')
        .mockResolvedValue(cartSharedDataMocks.cart);
      jest.spyOn(productService, 'get').mockResolvedValue({
        ...productSharedDataMocks.product,
        stock: 0,
      });

      await expect(
        service.create(authGlobalMocks.user.id, cartItemSharedDataMocks.item),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a cart item successfully', async () => {
      const dto = { quantity: 2 };

      service.get = jest.fn().mockResolvedValue(cartItemSharedDataMocks.item);
      jest
        .spyOn(productService, 'get')
        .mockResolvedValue(productSharedDataMocks.product);

      jest.spyOn(prismaService.cartItem, 'update').mockResolvedValue({
        ...cartItemSharedDataMocks.item,
        ...dto,
      });

      const result = await service.update(
        authGlobalMocks.user.id,
        cartSharedDataMocks.cart.id,
        dto,
      );

      expect(result).toEqual({ ...cartItemSharedDataMocks.item, ...dto });
      expect(service.get).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        cartSharedDataMocks.cart.id,
      );
      expect(productService.get).toHaveBeenCalledWith(
        productSharedDataMocks.product.id,
      );
      expect(prismaService.cartItem.update).toHaveBeenCalledWith({
        where: {
          id: cartSharedDataMocks.cart.id,
          AND: { cart: { userId: authGlobalMocks.user.id } },
        },
        data: { ...dto },
      });
    });
  });

  describe('delete', () => {
    it('should delete a cart item successfully', async () => {
      jest.spyOn(prismaService.cartItem, 'delete').mockResolvedValue({} as any);

      await service.delete(
        authGlobalMocks.user.id,
        cartSharedDataMocks.cart.id,
      );

      expect(prismaService.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: cartSharedDataMocks.cart.id,
          AND: { cart: { userId: authGlobalMocks.user.id } },
        },
      });
    });
  });

  describe('get', () => {
    it('should retrieve a cart item successfully', async () => {
      jest
        .spyOn(prismaService.cartItem, 'findUnique')
        .mockResolvedValue(cartItemSharedDataMocks.item);

      const result = await service.get(
        authGlobalMocks.user.id,
        cartSharedDataMocks.cart.id,
      );

      expect(result).toEqual(cartItemSharedDataMocks.item);
      expect(prismaService.cartItem.findUnique).toHaveBeenCalledWith({
        where: {
          id: cartSharedDataMocks.cart.id,
          cart: { AND: { userId: authGlobalMocks.user.id } },
        },
      });
    });
  });
});
