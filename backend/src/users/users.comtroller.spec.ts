
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

describe('UsersController', () => {
  let usersController: UsersController;
  const mockUsersService = {};
  const mockRoleGuard = { canActivate: true };
  const mockApiKeyGuard = { canActivate: true };
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
});
