import { Test, TestingModule } from '@nestjs/testing';
import { User } from './schemas/users.schemas';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  const mockUserModel = {};
  let usersService: UsersService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(async () => ({
          URL_RESET_PASSWORD: 'Any_Value',
          EMAIL_SENDER: '',
          EMAIL_SENDER_PASSWORD: '',
        })),
      ],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
});
