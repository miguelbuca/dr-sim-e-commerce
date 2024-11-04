import { productSharedDataMocks } from 'src/product/__mocks__';

export const item = {
  id: '1f629932-737c-4509-859e-e5dc2dd3407d',
  cartId: '252714cb-8f0f-474b-a000-df038cae5932',
  productId: '830f7644-ebda-4bb6-8e40-39a330127efd',
  quantity: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  product: productSharedDataMocks.product,
};

export const cartItems = [
  {
    id: '1f629932-737c-4509-859e-e5dc2dd3407d',
    cartId: '252714cb-8f0f-474b-a000-df038cae5932',
    productId: '830f7644-ebda-4bb6-8e40-39a330127efd',
    quantity: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    product: productSharedDataMocks.product,
  },
];
