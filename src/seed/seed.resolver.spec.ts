import { Test, TestingModule } from '@nestjs/testing';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

describe('SeedResolver', () => {
  let resolver: SeedResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeedResolver, SeedService],
    }).compile();

    resolver = module.get<SeedResolver>(SeedResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
