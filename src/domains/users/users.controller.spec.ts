import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SharedModule } from 'src/shared/shared.module';
import { ShirtSeedModelMock } from '../seed/mocks';
import { ShirtSeed } from '../seed/schemas';
import { User } from './schemas';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SharedModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: {} },
        {
          provide: getModelToken(ShirtSeed.name),
          useClass: ShirtSeedModelMock
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterAll(jest.clearAllMocks);

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
