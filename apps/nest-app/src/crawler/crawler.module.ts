import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [HttpModule],
  providers: [CrawlerService],
  exports: [CrawlerService],
})
export class CrawlerModule {}
