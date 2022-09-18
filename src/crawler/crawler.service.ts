import { siteDefiner } from './crawler.definer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { get } from 'lodash';
import cheerio = require('cheerio');

interface Rate {
  buy: string | number;
  sell: string | number;
  type: string;
}

@Injectable()
export class CrawlerService {
  private playwright: any;
  private context;
  private isModeAwsLambda: boolean;
  private browser;
  private engine;
  private page;
  private content;
  private closeAfterCrawl = true;

  private siteMap;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.isModeAwsLambda = this.configService.get('APP_AWS_LAMBDA_FUNCTION');
    this.siteMap = siteDefiner;
  }

  async scrapeWithPlaywright(site: string) {
    const data: Array<Rate> = [];
    if (this.siteMap[site]?.engine) {
      if (this.siteMap[site]?.engine == 'axios') {
        const req = await this.httpService
          .get(this.siteMap[site]?.url)
          .pipe(map((response) => response.data));

        const requestData = await lastValueFrom(req);

        const getFromElementObj = (data: any, selector: any) => {
          const rate: Rate = {
            sell: '0',
            buy: '0',
            type: selector.type,
          };

          rate.buy = get(data, selector?.buy)
            .replace(/[,.]00$/, '')
            .replace(/([a-zA-Z\/\s\.\,])*/g, '');

          rate.sell = get(data, selector?.sell)
            .replace(/[,.]00$/, '')
            .replace(/([a-zA-Z\/\s\.\,])*/g, '');

          rate.buy = parseInt(`${rate.buy}`) || 0;
          rate.sell = parseInt(`${rate.sell}`) || 0;

          return rate;
        };

        if (!Array.isArray(this.siteMap[site]?.selector)) {
          const rate = getFromElementObj(
            requestData,
            this.siteMap[site]?.selector,
          );

          data.push(rate);
        } else {
          this.siteMap[site]?.selector.forEach((e) => {
            const rate = getFromElementObj(requestData, e);

            data.push(rate);
          });
        }

        return {
          data,
          meta: {
            engine: this.engine,
            // error: 'something wrong',
            content: this.content,
          },
        };
      } else if (this.siteMap[site]?.engine == 'cheerio') {
        try {
          const req = await this.httpService
          .get(this.siteMap[site]?.url)
          .pipe(map((response) => response.data));

          const domElement = await lastValueFrom(req);

          this.content = domElement;


          const getFromElementDom = (dom: any, selector: any, formatter?: any) => {
            const $ = cheerio.load(dom);

            console.log(selector);

            const rate: Rate = {
              sell: '0',
              buy: '0',
              type: selector.type,
             };
            if (formatter?.buy) {
              const { buy } = formatter;
              // console.log(`formater`, dom(selector.buy).text());
              // rate.buy = formatter.buy($(selector.buy).text());
              rate.buy = buy($(selector.buy).text()) || 0;
            } else {
              rate.buy =
                $(selector.buy)
                  .text()
                  .trim()
                  .replace(/[,.]00$/, "")
                  .replace(/\(\-[0-9].*\)/g, "")
                  .replace(/([a-zA-Z\/\s\.\,])*/g, "") ?? null;

              rate.buy = parseInt(`${rate.buy}`) || 0;
            }

            if (formatter?.sell) {
              const { sell } = formatter;
              rate.sell = sell($(selector.sell).text()) || 0;
            } else {
              rate.sell =
                $(selector.sell)
                  .text()
                  .trim()
                  .replace(/[,.]00$/, "")
                  .replace(/\(\-[0-9].*\)/g, "")
                  .replace(/([a-zA-Z\/\s\.\,])*/g, "") ?? null;

              rate.sell = parseInt(`${rate.sell}`) || 0;
            }



          return rate;
        };

        if (!Array.isArray(this.siteMap[site]?.selector)) {
          const rate = getFromElementDom(domElement, this.siteMap[site]?.selector);

          data.push(rate);
        } else {
          this.siteMap[site]?.selector.forEach((e) => {
            const rate = getFromElementDom(domElement, e, this.siteMap[site]?.formatter);
            data.push(rate);
          });
        }

        return {
          data,
          meta: {
            engine: this.engine,
            // error: 'something wrong',
            // content: this.content,
          },
        }
        } catch (e) {
          return {
            data: null,
            meta: {
              engine: this.engine,
              error: (e as any).message,
              content: this.content,
            },
          };
        }
      }
    } else {
      if (this.isModeAwsLambda) {
        this.engine = 'playwright-aws-lambda';
        this.playwright = require('playwright-aws-lambda');
      } else {
        this.engine = 'playwright';
        this.playwright = require('playwright');
      }

      if (this.isModeAwsLambda) {
        this.browser = await this.playwright.launchChromium();
      } else {
        this.browser = await this.playwright?.chromium.launch({
          headless: false,
        });
      }

      this.context = await this.browser.newContext({
        bypassCSP: true,
      });

      this.page = await this.context.newPage();

      await this.page.route('**/*', (route: any) => {
        if (
          route
            .request()
            .resourceType()
            .match(/^(image|script|stylesheet|font|other)/)
        ) {
          return route.abort();
        } else {
          if (
            route
              .request()
              .url()
              .match(/https?:\/\/(.*youtube.*|.*widget\.php)/)
          ) {
            return route.abort();
          } else {
            console.log(route.request().resourceType(), route.request().url());
            return route.continue();
          }
        }
      });

      try {
        await this.page.goto(this.siteMap[site].url);

        this.content = await this.page.content();

        const getFromElement = async (e) => {
          console.log(e);
          const rate: Rate = {
            sell: '0',
            buy: '0',
            type: e.type,
          };

          if (e?.sell) {
            rate.sell = await this.page.$eval(e.sell, (e: any) =>
              e.innerText
                .trim()
                .replace(/\s+\d+[,]0+$/, '')
                .replace(/[,.]00$/, '')
                .replace(/([a-zA-Z\/\s\.\,])*/g, ''),
            );
            // .replace(/[,.]00$/, '')
            // .replace(/([a-zA-Z\/\s\.\,])*/g, ''),
            // );

            // console.log(rate.sell);
          }

          if (e?.buy) {
            rate.buy = await this.page.$eval(e.buy, (e: any) =>
              e.innerText
                .trim()
                .replace(/\s+\d+[,]0+$/, '')
                .replace(/[,.]00$/, '')
                .replace(/([a-zA-Z\/\s\.\,])*/g, ''),
            );
          }

          rate.buy = parseInt(`${rate.buy}`) || 0;
          rate.sell = parseInt(`${rate.sell}`) || 0;

          return rate;
        };

        if (!Array.isArray(this.siteMap[site]?.selector)) {
          const rate: Rate = await getFromElement(this.siteMap[site].selector);
          data.push(rate);
        } else {
          await this.siteMap[site]?.selector.forEach(async (el) => {
            const rate: Rate = await getFromElement(el);
            data.push(rate);
          });
        }

        await this.page.waitForLoadState('networkidle'); // This resolves after 'networkidle'

        if (this.closeAfterCrawl) {
          await this.browser.close();
        }

        const { url, name } = await this.siteMap[site];

        const scrape = { url, name };
        // console.log(data)

        return {
          data,
          meta: { scrape },
        };
      } catch (e) {
        if (this.browser != null) {
          await this.browser.close();
        }
        console.error(e);
        return {
          data: null,
          meta: {
            engine: this.engine,
            error: (e as any)?.message,
            content: this.content,
          },
        };
      }
    }
  }
}
