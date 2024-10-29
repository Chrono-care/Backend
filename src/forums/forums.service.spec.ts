import { Test, TestingModule } from '@nestjs/testing';
import { forumsService } from './forums.service';

describe('forumsService', () => {
  let service: forumsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [forumsService],
    }).compile();

    service = module.get<forumsService>(forumsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
