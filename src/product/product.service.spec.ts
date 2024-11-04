import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { productSharedDataMocks } from 'src/product/__mocks__';

describe('ProductService', () => {
  let service: ProductService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: {
            product: {
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const dto = productSharedDataMocks.product;
      jest.spyOn(prismaService.product, 'create').mockResolvedValue(dto);

      expect(await service.create(dto)).toEqual(dto);
      expect(prismaService.product.create).toHaveBeenCalledWith({
        data: { ...dto },
      });
    });

    it('should throw ForbiddenException if product already exists', async () => {
      const dto: ProductCreateDto = productSharedDataMocks.product;
      jest.spyOn(prismaService.product, 'create').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2002',
          clientVersion: 'prisma-client',
        }),
      );

      await expect(service.create(dto)).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if creation fails', async () => {
      const dto: ProductCreateDto = productSharedDataMocks.product;
      jest
        .spyOn(prismaService.product, 'create')
        .mockRejectedValue(new Error());

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const dto = {
        ...productSharedDataMocks.product,
        price: 150,
      };
      const id = productSharedDataMocks.product.id;
      jest.spyOn(prismaService.product, 'update').mockResolvedValue({ ...dto });

      expect(await service.update(id, dto)).toEqual({ id, ...dto });
      expect(prismaService.product.update).toHaveBeenCalledWith({
        data: dto,
        where: { id },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      const dto: ProductUpdateDto = {
        ...productSharedDataMocks.product,
        price: 150,
      };
      jest.spyOn(prismaService.product, 'update').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: 'prisma-client',
        }),
      );

      await expect(service.update('non-existent-id', dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if update fails', async () => {
      const dto: ProductUpdateDto = {
        ...productSharedDataMocks.product,
        price: 150,
      };
      jest
        .spyOn(prismaService.product, 'update')
        .mockRejectedValue(new Error());

      await expect(
        service.update(productSharedDataMocks.product.id, dto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('delete', () => {
    it('should delete a product successfully', async () => {
      const id = productSharedDataMocks.product.id;
      jest
        .spyOn(prismaService.product, 'delete')
        .mockResolvedValue({ id, ...productSharedDataMocks.product });

      await expect(service.delete(id)).resolves.toBeUndefined();
      expect(prismaService.product.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if product does not exist', async () => {
      jest.spyOn(prismaService.product, 'delete').mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('', {
          code: 'P2025',
          clientVersion: 'prisma-client',
        }),
      );

      await expect(service.delete('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw BadRequestException if deletion fails', async () => {
      jest
        .spyOn(prismaService.product, 'delete')
        .mockRejectedValue(new Error());

      await expect(
        service.delete(productSharedDataMocks.product.id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('get', () => {
    it('should retrieve a product successfully', async () => {
      const id = productSharedDataMocks.product.id;
      const product = productSharedDataMocks.product;
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockResolvedValue(product);

      expect(await service.get(id)).toEqual(product);
      expect(prismaService.product.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it('should throw NotFoundException if product is not found', async () => {
      jest.spyOn(prismaService.product, 'findUnique').mockResolvedValue(null);

      await expect(service.get('non-existent-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if retrieval fails', async () => {
      jest
        .spyOn(prismaService.product, 'findUnique')
        .mockRejectedValue(new Error());

      await expect(
        service.get(productSharedDataMocks.product.id),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAll', () => {
    it('should retrieve all products with pagination', async () => {
      const products = [{ ...productSharedDataMocks.product }];
      const totalItems = 1;
      const page = 1;
      const limit = 10;

      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(products);
      jest.spyOn(prismaService.product, 'count').mockResolvedValue(totalItems);

      const result = await service.getAll(page, limit);

      expect(result).toEqual({
        data: products,
        totalItems,
        totalPages: 1,
        currentPage: page,
      });
      expect(prismaService.product.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: limit,
      });
      expect(prismaService.product.count).toHaveBeenCalled();
    });

    it('should throw BadRequestException if retrieval fails', async () => {
      jest
        .spyOn(prismaService.product, 'findMany')
        .mockRejectedValue(new Error());

      await expect(service.getAll(1, 10)).rejects.toThrow(BadRequestException);
    });
  });
});
