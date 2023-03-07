import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeed } from './schemas';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  const findResult: ShirtSeed[] = [
    {
      image_url: 'string',
      name: 'string',
      price: 0,
      _id: 'string'
    }
  ];

  let controller: SeedController;
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [SeedController],
      providers: [
        SeedService,
        {
          provide: getModelToken(ShirtSeed.name),
          useValue: {
            find: async () => {
              return findResult;
            }
          }
        }
      ]
    }).compile();

    controller = module.get<SeedController>(SeedController);
    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getShirts', () => {
    it('should return a (normalized) response object with an array of shirt (seeds)', async () => {
      jest
        .spyOn(service, 'getShirts')
        .mockImplementation(() => Promise.resolve(findResult));
      expect(await controller.getShirts()).toStrictEqual({
        data: findResult,
        path: undefined
      });
    });
  });
});
