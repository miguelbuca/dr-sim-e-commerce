import { $Enums } from '@prisma/client';

export const user = {
  id: 'e3cb2733-9f74-4396-8a83-f7c2bd6b4965',
  firstName: 'Miguel',
  lastName: 'Buca',
  email: 'miguelpedrobuca@gmail.com',
  rule: $Enums.Rule.CUSTOMER,
  hash: '',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const password = '1234';
