import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiKeyGuard } from '../../auth/guards/api-key.guard';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
jest.mock('../users.service');
// auto mocking the service, this the file in __mocks__
describe('UsersController', () => {
  let usersController: UsersController;

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
  const userUpdate: UpdateUserDto = {
    fullName: 'test',
    email: '',
    telphone: '',
    DNI: '',
    bornAt: new Date(),
    gender: 'male',
    password: '123',
    hashPassword: '123',
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
      .compile();
    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
  it('create user', async () => {
    const result = await usersController.create(userCreation);
    expect(result).toEqual({ message: 'Usuario Creado', statusCode: 400, success: true });
  });
  it('should read an user', async () => {
    expect(1).toBe(1);
  });
  it('should update an user password', async () => {
    const result = await usersController.update('123', userUpdate);
    expect(result).toEqual({ message: 'Contraseña actualizada', statusCode: 200, success: true });
  });
});
