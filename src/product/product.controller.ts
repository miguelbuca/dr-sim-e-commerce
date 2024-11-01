import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductCreateDto, ProductUpdateDto } from './dto';
import { ProductService } from './product.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CacheKey } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Post()
  async create(
    @GetUser({
      rule: ['ADMIN'],
    })
    _,
    @Body() body: ProductCreateDto,
  ) {
    return this.productService.create(body);
  }
  @Patch(':id')
  async update(
    @GetUser({
      rule: ['ADMIN'],
    })
    _,
    @Param('id') id,
    @Body() body: ProductUpdateDto,
  ) {
    return this.productService.update(id, body);
  }
  @Delete(':id')
  async delete(
    @GetUser({
      rule: ['ADMIN'],
    })
    _,
    @Param('id') id,
  ) {
    return this.productService.delete(id);
  }
  @Get(':id')
  @CacheKey('product')
  async get(@Param('id') id) {
    return this.productService.get(id);
  }
  @Get()
  @CacheKey('products')
  async getAll(@Query() queries) {
    return this.productService.getAll(
      Number(queries?.page ?? 1),
      Number(queries?.limit ?? 10),
    );
  }
}
