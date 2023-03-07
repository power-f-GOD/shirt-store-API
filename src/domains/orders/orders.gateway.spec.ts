import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeed } from '../seed/schemas';
import { SeedService } from '../seed/seed.service';
import { User } from '../users/schemas';
import { UsersService } from '../users/users.service';
import { OrderModelMock, mockOrder } from './mocks';
import { OrdersGateway } from './orders.gateway';
import { OrdersService } from './orders.service';
import { Order } from './schemas';

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
          useValue: new OrderModelMock(mockOrder)
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

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
