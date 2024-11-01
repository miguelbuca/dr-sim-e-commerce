import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5,
      max: 10,
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    CartModule,
    CartItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
