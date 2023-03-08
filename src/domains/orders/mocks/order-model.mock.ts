import { Order } from '../schemas';

export class OrderModelMock {
  mockOrder: Order;

  constructor(mockOrder: Order) {
    this.mockOrder = mockOrder;
  }

  create = jest.fn((order: Order) => {
    return {
      ...order,
      ...this.mockOrder,
      items: order.items.map((item) => ({ ...item, _id: 'string', price: 0 }))
    };
  });

  find() {
    return {
      skip() {
        return this;
      },
      limit() {
        return this;
      },
      exec: jest.fn().mockResolvedValue(this.mockOrder)
    };
  }

  findById(id: string) {
    return {
      ...this.find(),
      exec: jest.fn(() => [this.mockOrder].find((order) => order._id === id))
    };
  }

  findOne(id: string) {
    return {
      ...this.find(),
      exec: jest.fn(() => [this.mockOrder].find((order) => order._id === id))
    };
  }
}
