import { ForbiddenException, Injectable } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private config: ConfigService,
    private prismaSerice: PrismaService,
  ) {}

  async signup({ password, ...dto }: SignUpDto) {
    try {
      return await this.prismaSerice.user.create({
        data: {
          ...dto,
          cart: {
            create: {},
          },
          hash: await argon.hash(password),
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    try {
      const user = await this.prismaSerice.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user) throw new ForbiddenException('Credrentials incorrect');

      const pwMacthes = await argon.verify(user.hash, dto.password);

      if (!pwMacthes) throw new ForbiddenException('Credrentials incorrect');
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentias taken');
        }
      }
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async validateToken(prisma: PrismaClient, token: string): Promise<any> {
    try {
      const decoded = this.jwt.verify(token, {
        secret: this.config.get('JWT_SECRET'),
      });
      const user = await prisma.user.findUnique({
        where: { id: decoded.sub },
      });
      return user;
    } catch {
      return null;
    }
  }
}
