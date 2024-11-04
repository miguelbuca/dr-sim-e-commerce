import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { global as globalAuthMocks } from 'src/auth/__mocks__';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signup: jest.fn(),
            signin: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should call AuthService.signup and return the result', async () => {
      const signupDto: SignUpDto = {
        email: globalAuthMocks.user.email,
        firstName: globalAuthMocks.user.firstName,
        lastName: globalAuthMocks.user.lastName,
        password: globalAuthMocks.password,
        rule: globalAuthMocks.user.rule,
      };
      const createdUser = { ...globalAuthMocks.user };
      jest.spyOn(authService, 'signup').mockResolvedValue(createdUser);

      const result = await authController.signup(signupDto);

      expect(result).toEqual(createdUser);
      expect(authService.signup).toHaveBeenCalledWith(signupDto);
    });
  });

  describe('signin', () => {
    it('should call AuthService.signin and return an access token', async () => {
      const signinDto: SignInDto = {
        email: globalAuthMocks.user.email,
        password: globalAuthMocks.password,
      };
      const token = { access_token: 'access-token' };
      jest.spyOn(authService, 'signin').mockResolvedValue(token);

      const result = await authController.signin(signinDto);

      expect(result).toEqual(token);
      expect(authService.signin).toHaveBeenCalledWith(signinDto);
    });

    it('should throw ForbiddenException if credentials are incorrect', async () => {
      const signinDto: SignInDto = {
        email: globalAuthMocks.user.email,
        password: globalAuthMocks.password,
      };
      jest
        .spyOn(authService, 'signin')
        .mockRejectedValue(new ForbiddenException('Credentials incorrect'));

      await expect(authController.signin(signinDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('user', () => {
    it('should return the user when JwtGuard is valid', async () => {
      const user: User = { id: 'user-id', email: 'user@example.com' } as User;

      const result = authController.user(user);

      expect(result).toEqual(user);
    });
  });
});
