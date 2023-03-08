import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeed } from '../seed/schemas';
import { SeedService } from '../seed/seed.service';
import { User } from '../users/schemas';
import { UsersService } from '../users/users.service';
import { OrderModelMock, orderMock, orderItemMock } from './mocks';
import { OrderItemModelMock } from './mocks/order-item-model.mock';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { Order, OrderItem } from './schemas';

describe('OrdersGateway', () => {
  let gateway: OrdersGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        OrdersGateway,
        OrdersService,
        UsersService,
        SeedService,
        {
          provide: getModelToken(Order.name),
          useValue: new OrderModelMock(orderMock)
        },
        {
          provide: getModelToken(OrderItem.name),
          useValue: new OrderItemModelMock(orderItemMock)
        },
        {
          provide: getModelToken(User.name),
          useValue: {}
        },
        {
          provide: getModelToken(ShirtSeed.name),
          useValue: {
            find() {
              return [];
            }
          }
        }
      ]
    }).compile();

    gateway = module.get<OrdersGateway>(OrdersGateway);
  });

  afterAll(jest.clearAllMocks);

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
