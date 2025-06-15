import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './core/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  getApp(): object {
    return this.appService.getResponse();
  }
}
