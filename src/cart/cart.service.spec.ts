import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { cartSharedDataMocks } from './__mocks__';

describe('CartService', () => {
  let service: CartService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: {
            cart: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a cart when found', async () => {
      jest
        .spyOn(prismaService.cart, 'findFirst')
        .mockResolvedValue(cartSharedDataMocks.cart);

      const result = await service.get('e3cb2733-9f74-4396-8a83-f7c2bd6b4965');
      expect(result).toEqual(cartSharedDataMocks.cart);
      expect(prismaService.cart.findFirst).toHaveBeenCalledWith({
        where: { AND: { userId: 'e3cb2733-9f74-4396-8a83-f7c2bd6b4965' } },
        include: { items: { include: { product: true } } },
      });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      jest
        .spyOn(prismaService.cart, 'findFirst')
        .mockRejectedValue(new Error());

      await expect(
        service.get('e3cb2733-9f74-4396-8a83-f7c2bd6b4965'),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
