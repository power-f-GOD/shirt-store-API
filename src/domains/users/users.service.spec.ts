import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { UserModelMock } from './mocks';
import { User } from './schemas';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useClass: UserModelMock
        }
      ]
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterAll(jest.clearAllMocks);

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
