import { Test, TestingModule } from '@nestjs/testing';
import { forumsController } from './forums.controller';

describe('forumsController', () => {
  let controller: forumsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [forumsController],
    }).compile();

    controller = module.get<forumsController>(forumsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
