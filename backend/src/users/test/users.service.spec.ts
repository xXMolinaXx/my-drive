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
  const email = 'test@email.com';
  class mockUserModel {
    constructor(private data) { }
    static findOne = jest.fn().mockImplementation((emailparam) => {
      if (emailparam.email === email) {
        return { ...userCreation, email: email };
      } else {
        return null;
      }
    });
    static find = jest.fn().mockImplementation(() => ({ countDocuments: jest.fn().mockImplementation(() => []) }));
    static findOneByEmail = jest.fn().mockImplementation((email: string) => ({ ...userCreation, email: email }));
    save = jest.fn().mockImplementation(() => { });
  }
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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });
  it('should create a hash password', async () => {
    const hash = await usersService.hashPassword('123');
    expect(hash).toBeDefined();
  });
  it('should create user', async () => {
    const response = await usersService.create(userCreation);
    expect(response).toBeUndefined();
  });
  it('should find an user by email', async () => {
    const response = await usersService.findOneByEmail(email);
    expect(response).toEqual({ ...userCreation, email: email });
  });
  it('should not find an user by email', async () => {
    usersService
      .findOneByEmail('email@email.com')
      .then(() => {})
      .catch((error) => {
        expect(error).toBe('No existe este usuario');
      });
  });
});
