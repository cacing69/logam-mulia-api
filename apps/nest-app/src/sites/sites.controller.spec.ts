import { Test, TestingModule } from '@nestjs/testing';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

describe('SitesController', () => {
  let controller: SitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SitesController],
      providers: [SitesService],
    }).compile();

    controller = module.get<SitesController>(SitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
