import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { User } from '../schemas/users.schemas';
import { UsersService } from '../users.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateUserDto } from '../dto/create-user.dto';


describe('UsersService', () => {
  const userCreation: CreateUserDto = {
    fullName: 'test',
    email: '',
    telphone: '',
    DNI: '',
    bornAt: new Date(),
    gender: 'male',
    password: '123',
  };

  class mockUserModel {
    constructor(private data) {}
    static findOne = jest.fn().mockImplementation(() => {});
    static find = jest.fn().mockImplementation(() => ({ countDocuments: jest.fn().mockImplementation(() => []) }));
    save = jest.fn().mockImplementation(() => {});
  };
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
  it('should create user', async () => {
    const response = await usersService.create(userCreation);
    expect(response).toBeUndefined();
  });
});
