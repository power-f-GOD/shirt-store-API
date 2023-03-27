import { Order } from '../schemas';
import { BaseModelMock } from './base-model.mock';

export class OrderModelMock extends BaseModelMock {
  constructor(mockOrder: Order) {
    super(mockOrder);
  }

  create = jest.fn((order: Order) => {
    console.log({ order });
    const createdOrder = {
      ...order,
      ...this.documentMock,
      items: order.items?.map(() => 'string') || [],
      user: 'string'
    };

    return {
      save: jest.fn(() => {
        return {
          populate() {
            return createdOrder;
          }
        };
      })
    };
  });
}
