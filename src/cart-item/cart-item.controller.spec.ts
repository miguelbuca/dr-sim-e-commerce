import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from './cart-item.controller';
import { CartItemService } from './cart-item.service';
import { CartItemCreateDto, CartItemUpdateDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { global as authGlobalMocks } from 'src/auth/__mocks__';
import { cartItemSharedDataMocks } from 'src/cart-item/__mocks__';
import { productSharedDataMocks } from 'src/product/__mocks__';

describe('CartItemController', () => {
  let controller: CartItemController;
  let service: CartItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [
        {
          provide: CartItemService,
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

    controller = module.get<CartItemController>(CartItemController);
    service = module.get<CartItemService>(CartItemService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call create method in service with correct parameters', async () => {
      const dto: CartItemCreateDto = {
        productId: productSharedDataMocks.product.id,
        quantity: 1,
      };
      await controller.create(authGlobalMocks.user, dto);
      expect(service.create).toHaveBeenCalledWith(authGlobalMocks.user.id, dto);
    });
  });

  describe('update', () => {
    it('should call update method in service with correct parameters', async () => {
      const dto: CartItemUpdateDto = { quantity: 2 };
      const cartItemId = cartItemSharedDataMocks.item.id;
      await controller.update(authGlobalMocks.user, cartItemId, dto);
      expect(service.update).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        cartItemId,
        dto,
      );
    });
  });

  describe('delete', () => {
    it('should call delete method in service with correct parameters', async () => {
      const cartItemId = cartItemSharedDataMocks.item.id;
      await controller.delete(authGlobalMocks.user, cartItemId);
      expect(service.delete).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        cartItemId,
      );
    });
  });

  describe('get', () => {
    it('should call get method in service with correct parameters', async () => {
      const cartItemId = cartItemSharedDataMocks.item.id;
      await controller.get(authGlobalMocks.user, cartItemId);
      expect(service.get).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        cartItemId,
      );
    });
  });

  describe('getAll', () => {
    it('should call getAll method in service with correct parameters', async () => {
      const page = 1;
      const limit = 10;
      await controller.getAll(authGlobalMocks.user, { page, limit });
      expect(service.getAll).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        page,
        limit,
      );
    });

    it('should use default pagination parameters if none are provided', async () => {
      await controller.getAll(authGlobalMocks.user, {});
      expect(service.getAll).toHaveBeenCalledWith(
        authGlobalMocks.user.id,
        1,
        10,
      );
    });
  });
});
