import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

type Rules = 'ADMIN' | 'CUSTOMER';

export const GetUser = createParamDecorator(
  (
    data:
      | keyof Omit<User, 'hash'>
      | {
          data?: string;
          rule: Rules[];
        }
      | undefined,
    ctx: ExecutionContext,
  ) => {
    const request = ctx.switchToHttp().getRequest();

    if (data && typeof data === 'string') {
      return request.user[data];
    }

    if (data && typeof data === 'object') {
      if (data.rule && !data.rule.includes(request.user.rule)) {
        throw new UnauthorizedException(
          `You need a ${data.rule.join(', ')} access.`,
        );
      } else if (data.data) {
        return request.user[data.data];
      } else return request.user;
    }

    return request.user;
  },
);
