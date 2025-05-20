import { Test, TestingModule } from '@nestjs/testing';
import { DockerComposeService } from './docker-compose.service';

describe('DockerComposeService', () => {
  let service: DockerComposeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DockerComposeService],
    }).compile();

    service = module.get<DockerComposeService>(DockerComposeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
