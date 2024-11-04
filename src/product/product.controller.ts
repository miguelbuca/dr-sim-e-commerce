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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';

@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'The product has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can create products.',
  })
  async create(
    @GetUser({
      rule: ['ADMIN'],
    })
    _: User,
    @Body() body: ProductCreateDto,
  ) {
    return this.productService.create(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to update',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully updated.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can update products.',
  })
  async update(
    @GetUser({
      rule: ['ADMIN'],
    })
    _: any,
    @Param('id') id: string,
    @Body() body: ProductUpdateDto,
  ) {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to delete',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully deleted.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Only admins can delete products.',
  })
  async delete(
    @GetUser({
      rule: ['ADMIN'],
    })
    _: any,
    @Param('id') id: string,
  ) {
    return this.productService.delete(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve details of a specific product' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the product to retrieve',
    example: '8fa85f64-5717-4562-b3fc-2c963f66afa6',
  })
  @CacheKey('product')
  @ApiResponse({
    status: 200,
    description: 'The product has been successfully retrieved.',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found.',
  })
  async get(@Param('id') id: string) {
    return this.productService.get(id);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of all products with pagination' })
  @CacheKey('products')
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'The page number to retrieve, for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'The number of products per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of products retrieved successfully.',
  })
  async getAll(@Query() queries: any) {
    return this.productService.getAll(
      Number(queries?.page ?? 1),
      Number(queries?.limit ?? 10),
    );
  }
}