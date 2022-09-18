import { siteDefiner } from './crawler.definer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { get } from 'lodash';
import cheerio = require('cheerio');
import { BadRequestException } from '../core/exceptions/bad-request.exception';

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
  private data;
  private site;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.isModeAwsLambda = this.configService.get("APP_AWS_LAMBDA_FUNCTION");
  }

  private defaultFormatter(value: string) {
    console.log(`defaultFormatter`, value);
    const trimValue =
      value
        ?.trim()
        ?.replace(/[,.]00$/, "")
        ?.replace(/\(\-[0-9].*\)/g, "")
        ?.replace(/([a-zA-Z\/\s\.\,])*/g, "") ?? null;

    return parseInt(trimValue);
  }

  async requestWithAxios(url: string) {
    const req = await this.httpService
      .get(url)
      .pipe(map((response) => response.data));

    return await lastValueFrom(req);
  }

  async scrapeWithCheerio() {
    const requestData = await this.requestWithAxios(this.site.url);

    this.content = requestData;

    if (this.checkIfSelectorIsArray()) {
      this.site.selector.forEach((e: any) => {
        const rate = this.getValueFromDom(requestData, e);
        this.data.push(rate);
      });

      return {
        data: this.data,
        meta: this.getMeta()
      };
    }
  }

  async scrapeWithAxios() {
    const requestData = await this.requestWithAxios(this.site?.site.url);

    this.content = requestData;

    if (this.checkIfSelectorIsArray()) {
      this.site?.selector.forEach((e) => {
        const rate = this.getValueFromObj(requestData, e);

        this.data.push(rate);
      });

      return {
        data: this.data,
        meta: this.getMeta(),
      };
    }
  }

  async scrapeWithPlaywright() {
    if (this.isModeAwsLambda) {
      this.engine = "playwright-aws-lambda";
      this.playwright = require("playwright-aws-lambda");
      this.browser = await this.playwright.launchChromium();
    } else {
      this.engine = "playwright";
      this.playwright = require("playwright");

      this.browser = await this.playwright?.chromium.launch({
        headless: false,
      });
    }

    this.context = await this.browser.newContext({
      bypassCSP: true,
    });

    this.page = await this.context.newPage();

    await this.page.route("**/*", (route: any) => {
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
      await this.page.goto(this.site.url);

      this.content = await this.page.content();

      if (this.checkIfSelectorIsArray()) {
        await this.site.selector.forEach(async (el: any) => {
          const rate: Rate = await this.getFromElement(el);
          this.data.push(rate);
        });

        await this.page.waitForLoadState("networkidle"); // This resolves after 'networkidle'

        if (this.closeAfterCrawl) {
          if (this.context != null) {
            await this.context.close();
          }

          if (this.browser != null) {
            await this.browser.close();
          }
        }

        return {
          data: this.data,
          meta: this.getMeta(),
        };
      }
    } catch (e) {
      await this.context?.close();
      await this.browser?.close();

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

  private getMeta(){
    return {
      url: this.site.url,
      engine: this.site.engine,
    }
  }

  private getValueFromObj(objectValue: any, selector: any) {
    const rate: Rate = this.createRateFromSelector(selector);

    rate.buy = get(objectValue, selector?.buy);
    rate.sell = get(objectValue, selector?.sell);

    return this.checkWithFormatter(rate);
  }

  private async getFromElement(selector: any) {
    const rate: Rate = this.createRateFromSelector(selector);

    if (this.checkBuyAndSellSelector(selector)) {
      rate.sell = await this.page.$eval(selector.sell, (e: any) =>
        e.innerText?.trim()
      );
      rate.buy = await this.page.$eval(selector.buy, (e: any) =>
        e.innerText?.trim()
      );
    }

    return this.checkWithFormatter(rate);
  }

  private getValueFromDom(dom: any, selector: any) {
    if (this.checkBuyAndSellSelector(selector)) {
      const $ = cheerio.load(dom);

      const rate: Rate = this.createRateFromSelector(selector);
      rate.buy = $(selector.buy).text();
      rate.sell = $(selector.sell).text();

      return this.checkWithFormatter(rate);
    }
  }

  private checkWithFormatter(rate: Rate) {
    if ('formatter' in this.site) {
      const { buy, sell } = this.site.formatter;

      rate.buy = buy(rate.buy);
      rate.sell = sell(rate.sell);
    } else {
      rate.buy = this.defaultFormatter(`${rate.buy}`);
      rate.sell = this.defaultFormatter(`${rate.sell}`);
    }

    return rate;
  }

  private checkBuyAndSellSelector(selector) {
    if ("sell" in selector && "buy" in selector) return true;

    throw new BadRequestException(
      "element selector must be contains buy and sell key"
    );
  }

  private checkIfSelectorIsArray() {
    if (Array.isArray(this.site.selector)) return true;

    throw new BadRequestException(
      "selector on crawler definer must be an array!"
    );
  }

  private createRateFromSelector(selector): Rate {
    return {
      sell: "0",
      buy: "0",
      type: selector.type,
    };
  }

  async scrape(site: string) {
    if (!(site in siteDefiner)) {
      throw new BadRequestException(
        `there is no ${site} registered on definer`
      );
    }

    this.site = siteDefiner[site];

    this.data = [];

    if (this.site?.engine) {
      if (this.site.engine == "axios") {
        return await this.scrapeWithAxios();
      } else if (this.site.engine == "cheerio") {
        return await this.scrapeWithCheerio();
      } else if (this.site.engine == "playwright") {
        return await this.scrapeWithPlaywright();
      }
    } else {
      throw new BadRequestException('there is no engine provided on definer')
    }
  }
}
