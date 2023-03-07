import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { request as req, Request } from 'express';
import { Model } from 'mongoose';

import { SharedModule } from 'src/shared/shared.module';
import { Order } from './schemas';
import { OrdersService } from './orders.service';
import { BaseQueryDto } from 'src/shared/dtos';
import { SeedService } from '../seed/seed.service';
import { ShirtSeed } from '../seed/schemas';
import { mockOrder, mockQuery, mockUser, OrderModelMock } from './mocks';
import { createOrderDtosMock, ShirtSeedModelMock } from '../seed/mocks';
import { CreateOrderDto } from './dtos';

describe('OrdersService', () => {
  const request = req as Request<any, any, any, BaseQueryDto>;
  let service: OrdersService;
  let model: Model<Order>;
  let seedService: SeedService;

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
          useClass: ShirtSeedModelMock
        },
        {
          provide: getModelToken(Order.name),
          useValue: new OrderModelMock(mockOrder)
        }
      ]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    model = module.get<Model<Order>>(getModelToken(Order.name));
    seedService = module.get<SeedService>(SeedService);
  });

  afterAll(() => {
    jest.clearAllMocks();
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

    it('should reject if the correct payload is not passed in', async () => {
      await expect(async () => {
        await service.create({} as any);
      }).rejects.toBeTruthy();
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

    it('should return `null` or `undefined` if found none', async () => {
      expect(await service.findOne('')).toBeFalsy();
    });
  });

  describe('computeDiscount', () => {
    it(`should return a partial Order object with correct values: {
        actual_cost: number,
        cost: number,
        discount: number
      }. See the logs above to see the possible discounted costs.`, async () => {
      await seedService.seed();
      expect(
        await service.computeDiscount(createOrderDtosMock[0].items)
      ).toStrictEqual<Awaited<ReturnType<typeof service.computeDiscount>>>({
        actual_cost: 64.0,
        cost: 53.6,
        discount: 0.162
      });
      expect(
        await service.computeDiscount(createOrderDtosMock[1].items)
      ).toStrictEqual<Awaited<ReturnType<typeof service.computeDiscount>>>({
        actual_cost: 360,
        cost: 334.4,
        discount: 0.071
      });
    });

    it('should throw/reject if incorrect data is passed in', async () => {
      await seedService.seed();
      await expect(
        async () => await service.computeDiscount({ Givench: { count: 9 } })
      ).rejects.toStrictEqual(new Error('Invalid shirt, "Givench".'));
    });
  });
});
