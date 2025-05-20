import { Test, TestingModule } from '@nestjs/testing';
import { ServerManagementService } from './server-management.service';

describe('ServerManagementService', () => {
  let service: ServerManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServerManagementService],
    }).compile();

    service = module.get<ServerManagementService>(ServerManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
