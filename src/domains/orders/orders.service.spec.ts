import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { request as req, Request } from 'express';

import { SharedModule } from 'src/shared/shared.module';
import { Order } from './schemas';
import { OrdersService } from './orders.service';
import { BaseQueryDto } from 'src/shared/dtos';
import { SeedService } from '../seed/seed.service';
import { ShirtSeed } from '../seed/schemas';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dtos';
import { mockOrder, mockQuery, mockUser, OrderModelMock } from './mocks';

describe('OrdersService', () => {
  const request = req as Request<any, any, any, BaseQueryDto>;
  let service: OrdersService;
  let model: Model<Order>;

  request.user = mockUser;
  request.query = mockQuery;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        OrdersService,
        SeedService,
        {
          provide: getModelToken(ShirtSeed.name),
          useValue: {
            async find() {
              return [];
            }
          }
        },
        {
          provide: getModelToken(Order.name),
          useValue: new OrderModelMock(mockOrder)
        }
      ]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and return an Order object', async () => {
      const payload: CreateOrderDto = {
        items: { '[item_name]': { count: 0 } }
      };
      const order = await service.create(payload);

      expect(order).toStrictEqual(mockOrder);
      expect(order.items[0]).toStrictEqual({
        ...mockOrder.items[0],
        ...payload.items['[item_name]'],
        name: '[item_name]'
      });
      expect(model.create).toHaveBeenCalledWith(payload);
      expect(await service.create(payload)).toStrictEqual(mockOrder);
    });
  });

  describe('getAll', () => {
    it('should return an array of orders', async () => {
      expect(await service.getAll(request)).toStrictEqual(mockOrder);
    });
  });

  describe('findOne', () => {
    it('should return an Order if found', async () => {
      expect(await service.findOne('string')).toStrictEqual(mockOrder);
    });
  });
});
