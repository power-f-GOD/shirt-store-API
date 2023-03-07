import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeed } from './schemas';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  const findResult: ShirtSeed[] = [
    {
      image_url: 'string',
      name: 'string',
      price: 0,
      _id: 'string'
    }
  ];

  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        SeedService,
        {
          provide: getModelToken(ShirtSeed.name),
          useValue: {
            async find() {
              return findResult;
            }
          }
        }
      ]
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getShirts', () => {
    it('should return an array of shirt (seeds)', async () => {
      jest
        .spyOn(service, 'getShirts')
        .mockImplementation(() => Promise.resolve(findResult));
      expect(await service.getShirts()).toStrictEqual(findResult);
    });
  });

  describe('seed', () => {
    it('should trigger `seedShirts`', async () => {
      jest
        .spyOn(service, 'seedShirts')
        .mockImplementation(() => Promise.resolve(undefined));
      jest.spyOn(service, 'seed').mockImplementation(() => {
        service.seedShirts();
      });
      service.seed();
      expect(service.seed).toHaveReturned();
      expect(service.seedShirts).toHaveReturned();
    });
  });
});
