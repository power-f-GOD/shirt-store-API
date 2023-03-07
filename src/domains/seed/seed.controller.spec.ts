import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeedModelMock, shirtSeedsMock } from './mocks';
import { ShirtSeed } from './schemas';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  let controller: SeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [SeedController],
      providers: [
        SeedService,
        {
          provide: getModelToken(ShirtSeed.name),
          useClass: ShirtSeedModelMock
        }
      ]
    }).compile();

    controller = module.get<SeedController>(SeedController);
  });

  afterAll(jest.clearAllMocks);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getShirts', () => {
    it('should return a (normalized) response object with an array of shirt (seeds)', async () => {
      expect(await controller.getShirts()).toStrictEqual({
        data: shirtSeedsMock,
        path: undefined
      });
    });
  });
});
