import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { cartSharedDataMocks } from './__mocks__';
import { global as authGlobalMocks } from 'src/auth/__mocks__';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const mockCartService = {
      get: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [
        {
          provide: CartService,
          useValue: mockCartService,
        },
      ],
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCart', () => {
    it('should return cart data', async () => {
      jest.spyOn(service, 'get').mockResolvedValue(cartSharedDataMocks.cart);

      const result = await controller.get(authGlobalMocks.user);
      expect(result).toEqual(cartSharedDataMocks.cart);
      expect(service.get).toHaveBeenCalledWith(authGlobalMocks.user.id);
    });
  });
});
