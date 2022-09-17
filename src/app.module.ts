import { IsUniqueConstraint } from './core/decorators/is-unique.decorator';
import { IsExistConstraint } from './core/decorators/is-exist.decorator';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PricesModule } from './prices/prices.module';
import { CrawlerModule } from './crawler/crawler.module';
// import { DatabaseModule } from './database/database.module';
import { SitesModule } from './sites/sites.module';
import Joi = require('@hapi/joi');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        APP_MODE: Joi.string().required(),
        APP_AWS_LAMBDA_FUNCTION: Joi.boolean().required(),
        // DATABASE_HOST: Joi.string().required(),
        // DATABASE_PORT: Joi.number().required(),
        // DATABASE_USER: Joi.string().required(),
        // DATABASE_PASSWORD: Joi.string().required(),
        // DATABASE_NAME: Joi.string().required(),
      }),
      envFilePath: ['.env'],
    }),
    // DatabaseModule,
    PricesModule,
    CrawlerModule,
    SitesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // IsExistConstraint,
    // IsUniqueConstraint
  ],
})
export class AppModule {}
