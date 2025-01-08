
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {
    create: jest.fn().mockImplementation((dto) => {}),
  };
  const mockRoleGuard = { canActivate: true };
  const mockApiKeyGuard = { canActivate: true };
  const userCreation: CreateUserDto = {
    fullName: 'test',
    email: '',
    telphone: '',
    DNI: '',
    bornAt: new Date(),
    gender: 'male',
    password: '123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRoleGuard)
      .overrideGuard(ApiKeyGuard)
      .useValue(mockApiKeyGuard)
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
  it('create user', async () => {
    const result = await usersController.create(userCreation);
    expect(result).toEqual({ message: 'Usuario Creado', statusCode: 200, success: true });
  });
});
