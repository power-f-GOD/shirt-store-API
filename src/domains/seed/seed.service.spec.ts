import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeedModelMock } from './mocks';
import { ShirtSeed } from './schemas';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  const shirtSeeds: ShirtSeed[] = [
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
          useClass: ShirtSeedModelMock
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
        .mockImplementation(() => Promise.resolve(shirtSeeds));
      expect(await service.getShirts()).toStrictEqual(shirtSeeds);
    });
  });

  describe('seed', () => {
    it('should trigger `seedShirts`', async () => {
      jest.spyOn(service, 'seedShirts');
      jest.spyOn(service, 'seed');
      await service.seed();
      expect(service.seed).toHaveReturned();
      expect(service.seedShirts).toHaveReturned();
    });
  });
});
