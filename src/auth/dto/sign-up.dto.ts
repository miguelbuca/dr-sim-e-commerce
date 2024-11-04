import { $Enums, User } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto
  implements Omit<User, 'id' | 'hash' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'CUSTOMER',
    description: 'The role of the user, can be ADMIN or CUSTOMER',
    enum: ['ADMIN', 'CUSTOMER'],
    required: false,
  })
  @IsEnum(['ADMIN', 'CUSTOMER'])
  @IsOptional()
  rule: $Enums.Rule;

  @ApiProperty({
    example: 'jhondoe@example.com',
    description: 'The email address of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'StrongP@ssw0rd!',
    description: 'The password for the user account',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}