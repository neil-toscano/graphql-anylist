import { Test, TestingModule } from '@nestjs/testing';
import { ListitemService } from './listitem.service';

describe('ListitemService', () => {
  let service: ListitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ListitemService],
    }).compile();

    service = module.get<ListitemService>(ListitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
