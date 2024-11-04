import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { SignInDto, SignUpDto } from './dto';
import { global as globalAuthMocks } from 'src/auth/__mocks__';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

jest.mock('argon2', () => ({
  hash: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let mockJwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    mockJwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a user successfully', async () => {
      const signupDto: SignUpDto = {
        email: globalAuthMocks.user.email,
        firstName: globalAuthMocks.user.firstName,
        lastName: globalAuthMocks.user.lastName,
        rule: globalAuthMocks.user.rule,
        password: globalAuthMocks.password,
      };
      (argon.hash as jest.Mock).mockResolvedValue('hashed-password');
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        ...globalAuthMocks.user,
      });

      const result = await authService.signup(signupDto);

      expect(result).toEqual(globalAuthMocks.user);
    });
    it('should throw ForbiddenException if credentials are taken', async () => {
      const signupDto: SignUpDto = {
        email: globalAuthMocks.user.email,
        firstName: globalAuthMocks.user.firstName,
        lastName: globalAuthMocks.user.lastName,
        password: globalAuthMocks.password,
        rule: globalAuthMocks.user.rule,
      };
      jest
        .spyOn(prismaService.user, 'create')
        .mockRejectedValue(new ForbiddenException('Credentials incorrect'));

      await expect(authService.signup(signupDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('signin', () => {
    it('should sign in a user successfully', async () => {
      const signinDto: SignInDto = {
        email: globalAuthMocks.user.email,
        password: globalAuthMocks.password,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(globalAuthMocks.user);
      (argon.verify as jest.Mock).mockResolvedValue(true);
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValue('access-token');

      const result = await authService.signin(signinDto);

      expect(result).toEqual({ access_token: 'access-token' });
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const signinDto: SignInDto = {
        email: globalAuthMocks.user.email,
        password: globalAuthMocks.password,
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(globalAuthMocks.user);
      (argon.verify as jest.Mock).mockResolvedValue(false);

      await expect(authService.signin(signinDto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('signToken', () => {
    it('should return an access token', async () => {
      const userId = globalAuthMocks.user.id;
      const email = globalAuthMocks.user.email;
      jest.spyOn(mockJwtService, 'signAsync').mockResolvedValue('access-token');

      const result = await authService.signToken(userId, email);

      expect(result).toEqual({ access_token: 'access-token' });
    });
  });

  describe('validateToken', () => {
    it('should return user if token is valid', async () => {
      const token = 'valid-token';
      const decoded = { sub: globalAuthMocks.user.id };

      jest.spyOn(mockJwtService, 'verify').mockReturnValue(decoded);
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue(globalAuthMocks.user);

      const result = await authService.validateToken(
        prismaService as any,
        token,
      );
      expect(result).toEqual(globalAuthMocks.user);
    });
  });
});
