import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from './env-config.service';
import { EnvConfigModule } from './env-config.module';

describe('EnvConfigService', () => {
  let service: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule],
    }).compile();

    service = module.get<EnvConfigService>(EnvConfigService);
  });

  it('check env file', () => {
    expect(service.zone).toEqual('local');
  });
});
