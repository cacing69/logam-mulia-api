import { Module } from '@nestjs/common';
import { DefinerService } from './definer.service';

@Module({
  providers: [DefinerService],
  exports: [DefinerService]
})
export class DefinerModule {}
