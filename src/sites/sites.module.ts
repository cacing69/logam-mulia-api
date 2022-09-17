import { Module } from '@nestjs/common';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

@Module({
  controllers: [SitesController],
  providers: [SitesService]
})
export class SitesModule {}
