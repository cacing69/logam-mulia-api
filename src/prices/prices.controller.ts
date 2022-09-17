import { CrawlerService } from './../crawler/crawler.service';
import { Controller, Get, Param } from '@nestjs/common';
import { PricesService } from './prices.service';
import { Public } from '../core/decorators/public.decorator';

@Controller('prices')
export class PricesController {
  constructor(
    private readonly pricesService: PricesService,
    private readonly crawlerService: CrawlerService,
  ) {}

  @Get(':site')
  @Public()
  async getPrices(@Param() param: { site: string }) {
    const data: any = await this.crawlerService.scrapeWithPlaywright(
      param.site,
    );
    return data;
  }
}
