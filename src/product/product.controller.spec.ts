import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { productSharedDataMocks } from 'src/product/__mocks__';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
            getAll: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method in service with correct parameters', async () => {
      const dto: ProductCreateDto = productSharedDataMocks.product;
      await controller.create(null, dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call update method in service with correct parameters', async () => {
      const dto = {
        price: 150,
        name: '',
        description: '',
        stock: 0,
      };
      const productId = productSharedDataMocks.product.id;
      await controller.update(null, productId, dto);
      expect(service.update).toHaveBeenCalledWith(productId, dto);
    });
  });

  describe('delete', () => {
    it('should call delete method in service with correct parameters', async () => {
      const productId = productSharedDataMocks.product.id;
      await controller.delete(null, productId);
      expect(service.delete).toHaveBeenCalledWith(productId);
    });
  });

  describe('get', () => {
    it('should call get method in service with correct parameters', async () => {
      const productId = productSharedDataMocks.product.id;
      await controller.get(productId);
      expect(service.get).toHaveBeenCalledWith(productId);
    });
  });

  describe('getAll', () => {
    it('should call getAll method in service with correct parameters', async () => {
      const page = 1;
      const limit = 10;
      await controller.getAll({ page, limit });
      expect(service.getAll).toHaveBeenCalledWith(page, limit);
    });

    it('should use default pagination parameters if none are provided', async () => {
      await controller.getAll({});
      expect(service.getAll).toHaveBeenCalledWith(1, 10);
    });
  });
});
