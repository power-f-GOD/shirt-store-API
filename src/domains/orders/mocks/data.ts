import { Request } from 'express';
import { User } from 'src/domains/users/schemas';
import { BaseQueryDto } from 'src/shared/dtos';
import { Order, OrderItem } from '../schemas';

export const orderItemMock: OrderItem = {
  count: 0,
  name: 'Givenchy',
  _id: 'string',
  price: 0
};

export const orderMock: Order = {
  _id: 'string',
  actual_cost: 0,
  cost: 0,
  created_at: 'string',
  discount: 0,
  item_count: 0,
  items: ['string'],
  updated_at: 'string',
  user: 'string'
};

export const userMock: User = {
  username: 'string',
  _id: 'string',
  authenticated: false,
  created_at: 'string'
};

export const queryMock: Request<any, any, any, BaseQueryDto>['query'] = {
  count: 1,
  skip: 0
};
