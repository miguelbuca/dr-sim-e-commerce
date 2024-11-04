import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { GetUser } from './decorator';
import { User } from '@prisma/client';
import { JwtGuard } from './guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully signed up.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. Validation failed or user already exists.',
  })
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  @ApiOperation({ summary: 'Authenticate user and return a JWT token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully signed in. Returns a JWT token.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Invalid credentials.',
  })
  signin(@Body() dto: SignInDto) {
    return this.authService.signin(dto);
  }

  @Get('user')
  @ApiOperation({ summary: 'Retrieve information of the authenticated user' })
  @ApiBearerAuth('access-token')
  @UseGuards(JwtGuard)
  @ApiResponse({
    status: 200,
    description: 'Returns the authenticated user information.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized. Token is missing or invalid.',
  })
  user(@GetUser() user: User) {
    return user;
  }
}