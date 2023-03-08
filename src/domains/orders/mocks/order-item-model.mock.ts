import { OrderItem } from '../schemas';
import { BaseModelMock } from './base-model.mock';

export class OrderItemModelMock extends BaseModelMock<OrderItem> {
  constructor(mockOrder: OrderItem) {
    super(mockOrder);
  }

  create = jest.fn((items: OrderItem[]) => {
    return items.map((item) => ({ ...item, _id: 'string', price: 0 }));
  });
}
