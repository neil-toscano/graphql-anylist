import { Test, TestingModule } from '@nestjs/testing';
import { ListitemResolver } from './listitem.resolver';
import { ListitemService } from './listitem.service';

describe('ListitemResolver', () => {
  let resolver: ListitemResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListitemResolver, ListitemService],
    }).compile();

    resolver = module.get<ListitemResolver>(ListitemResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
