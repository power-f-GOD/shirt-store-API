import { Order } from '../schemas';
import { BaseModelMock } from './base-model.mock';

export class OrderModelMock extends BaseModelMock {
  constructor(mockOrder: Order) {
    super(mockOrder);
  }

  create = jest.fn((order: Order) => {
    return {
      ...order,
      ...this.documentMock,
      items: order.items.map(() => 'string'),
      user: 'string'
    };
  });
}
