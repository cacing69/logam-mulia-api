import { CrawlerModule } from './../crawler/crawler.module';
import { Module } from '@nestjs/common';
import { PricesService } from './prices.service';
import { PricesController } from './prices.controller';

@Module({
  imports: [CrawlerModule],
  controllers: [PricesController],
  providers: [PricesService],
})
export class PricesModule {}
