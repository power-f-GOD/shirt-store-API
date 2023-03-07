import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { request as req, Request } from 'express';

import { SharedModule } from 'src/shared/shared.module';
import { Order } from './schemas';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BaseQueryDto } from 'src/shared/dtos';
import { SeedService } from '../seed/seed.service';
import { ShirtSeed } from '../seed/schemas';

describe('OrdersController', () => {
  const findResult: Order[] = [
    {
      _id: 'string',
      actual_cost: 0,
      cost: 0,
      created_at: 'string',
      discount: 0,
      item_count: 0,
      items: [{ count: 0, name: 'string', _id: 'string', price: 0 }],
      updated_at: 'string'
    }
  ];
  const request = req as Request<any, any, any, BaseQueryDto>;

  request.user = {
    name: 'string',
    _id: 'string',
    authenticated: false,
    created_at: 'string'
  };

  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [OrdersController],
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
          useValue: {
            async find() {
              return findResult;
            }
          }
        }
      ]
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterAll(jest.clearAllMocks);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order and return an Order object', async () => {
      jest
        .spyOn(service, 'create')
        .mockImplementation(() => Promise.resolve(findResult[0]));
      expect(
        await controller.create(
          { items: { '[item_name]': { count: 0 } } },
          request as Request
        )
      ).toStrictEqual({
        data: findResult[0],
        path: undefined
      });
    });
  });

  describe('getAll', () => {
    it('should return a (normalized) response object with an array of orders', async () => {
      jest
        .spyOn(service, 'getAll')
        .mockImplementation(() => Promise.resolve(findResult));
      expect(await controller.getAll(request)).toStrictEqual({
        data: findResult,
        path: undefined
      });
    });
  });

  describe('findOne', () => {
    it('should return an Order if found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(findResult[0]));
      expect(
        await controller.findOne('string', request as Request)
      ).toStrictEqual({
        data: findResult[0],
        path: undefined
      });
    });
  });
});
