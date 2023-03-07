import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShirtSeedModelMock } from './domains/seed/mocks';
import { ShirtSeed } from './domains/seed/schemas';
import { SeedService } from './domains/seed/seed.service';
import { UserModelMock } from './domains/users/mocks';
import { User } from './domains/users/schemas';
import { SharedModule } from './shared/shared.module';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [AppController],
      providers: [
        AppService,
        SeedService,
        {
          provide: getModelToken(ShirtSeed.name),
          useClass: ShirtSeedModelMock
        },
        {
          provide: getModelToken(User.name),
          useClass: UserModelMock
        }
      ]
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return Hello! Shirt Store! object', () => {
      expect(appController.getHello()).toStrictEqual({
        'Hello!': 'Shirt Store!'
      });
    });
  });
});
