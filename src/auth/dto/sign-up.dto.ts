import { $Enums, User } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignUpDto
  implements Omit<User, 'id' | 'hash' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(['ADMIN', 'CUSTOMER'])
  @IsOptional()
  rule: $Enums.Rule;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
