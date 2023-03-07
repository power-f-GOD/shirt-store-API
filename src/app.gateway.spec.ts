import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppGateway } from './app.gateway';
import { ShirtSeedModelMock } from './domains/seed/mocks';
import { ShirtSeed } from './domains/seed/schemas';
import { SeedService } from './domains/seed/seed.service';
import { UserModelMock } from './domains/users/mocks';
import { User } from './domains/users/schemas';
import { UsersService } from './domains/users/users.service';
import { SharedModule } from './shared/shared.module';

describe('AppGateway', () => {
  let gateway: AppGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      providers: [
        AppGateway,
        SeedService,
        UsersService,
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

    gateway = module.get<AppGateway>(AppGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
