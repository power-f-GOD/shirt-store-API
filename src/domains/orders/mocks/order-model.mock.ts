import { CreateOrderDto } from '../dtos';
import { Order } from '../schemas';

export class OrderModelMock {
  mockOrder: Order;

  constructor(mockOrder: Order) {
    this.mockOrder = mockOrder;
  }

  create = jest.fn((createOrderDto: CreateOrderDto) => {
    const items: Partial<Order['items'][0]>[] = Object.keys(
      createOrderDto.items
    ).map((name, i) => ({
      ...this.mockOrder.items[i],
      name,
      count: createOrderDto.items[name].count
    }));

    return { ...this.mockOrder, items };
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
