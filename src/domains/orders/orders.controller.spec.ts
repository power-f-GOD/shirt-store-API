import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { request as req, Request } from 'express';

import { SharedModule } from 'src/shared/shared.module';
import { Order, OrderItem } from './schemas';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { BaseQueryDto } from 'src/shared/dtos';
import { SeedService } from '../seed/seed.service';
import { ShirtSeed } from '../seed/schemas';
import { orderItemMock, orderMock, OrderModelMock, userMock } from './mocks';
import { ShirtSeedModelMock } from '../seed/mocks';
import { OrderItemModelMock } from './mocks/order-item-model.mock';

describe('OrdersController', () => {
  const request = req as Request<any, any, any, BaseQueryDto>;

  request.user = userMock;

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
          useClass: ShirtSeedModelMock
        },
        {
          provide: getModelToken(Order.name),
          useValue: new OrderModelMock(orderMock)
        },
        {
          provide: getModelToken(OrderItem.name),
          useValue: new OrderItemModelMock(orderItemMock)
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
        .mockImplementation(() => Promise.resolve(orderMock));
      expect(
        await controller.create(
          { items: { '[item_name]': { count: 0 } } },
          request as Request
        )
      ).toStrictEqual({
        data: orderMock,
        path: undefined,
        message: `Order (with ID \"#STRING\") successfully placed!📝😎`
      });
    });
  });

  describe('getAll', () => {
    it('should return a (normalized) response object with an array of orders', async () => {
      jest
        .spyOn(service, 'getAll')
        .mockImplementation(() => Promise.resolve([orderMock]));
      expect(await controller.getAll(request)).toStrictEqual({
        data: [orderMock],
        path: undefined
      });
    });
  });

  describe('findOne', () => {
    it('should return an Order if found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockImplementation(() => Promise.resolve(orderMock));
      expect(
        await controller.findOne('string', request as Request)
      ).toStrictEqual({
        data: orderMock,
        path: undefined
      });
    });
  });
});
