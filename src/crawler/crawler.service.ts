import { format } from 'path';
import { siteDefiner } from './crawler.definer';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom, map } from 'rxjs';
import { get } from 'lodash';
import cheerio = require('cheerio');
import { BadRequestException } from '../core/exceptions/bad-request.exception';
import UserAgent from 'user-agents';
import axios from 'axios';


interface Rate {
  buy: string | number;
  sell: string | number;
  type: string;
  info: string;
  weight: string| number;
  unit: string;
}

@Injectable()
export class CrawlerService {
  private playwright: any;
  private context;
  private isModeAwsLambda: boolean;
  private isHeadless: boolean;
  private useMirror: boolean;
  private urlMirror: string;
  private browser;
  private engine;
  private page;
  private content;
  private closeAfterCrawl = true;
  private data;
  private site;
  private siteName;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.isModeAwsLambda = this.configService.get("APP_AWS_LAMBDA_FUNCTION");
    this.isHeadless = this.configService.get("APP_HEADLESS");
    this.useMirror = this.configService.get("APP_USE_MIRROR");
    this.urlMirror = this.configService.get("APP_MIRROR_URL");
  }

  private defaultFormatter(value: string) {
    const trimValue =
      value
        ?.trim()
        ?.replace(/[,.]00$/, "")
        ?.replace(/\(\-[0-9].*\)/g, "")
        ?.replace(/([a-zA-Z\/\s\.\,])*/g, "") ?? null;

    return parseInt(trimValue);
  }

  async requestWithAxios(url: string, method: string = "GET") {
    if (method === "POST") {
      const req = await this.httpService
        .post(url, {}) // jika butuh body, sesuaikan
        .pipe(map((response) => response.data));
      return await lastValueFrom(req);
    } else {
      const req = await this.httpService
        .get(url)
        .pipe(map((response) => response.data));
      return await lastValueFrom(req);
    }
  }

  async scrapeWithCheerio() {
    const requestData = await this.requestWithAxios(this.site.url);

    this.content = requestData;

    if (this.checkIfSelectorIsArray()) {
      for (const e of this.site.selector) {
        // Tunggu hasil dari getValueFromDom
        const rate = await this.getValueFromDom(requestData, e);
        this.data.push(rate);
      }

      return {
        data: this.data,
        meta: this.getMeta()
      };
    }
  }

  async scrapeWithAxios() {
    const method = this.site.method || "GET";
    const requestData = await this.requestWithAxios(this.site?.url, method);

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

  async scrapeOnMirror() {
    const requestData = await axios.get(`${this.urlMirror}/prices/${this.siteName}`);

    return requestData.data;
  }

  async scrapeWithPlaywright() {

    // const urlProxy = "https://proxylist.geonode.com/api/proxy-list?speed=fast&google=false&limit=500&page=1&sort_by=lastChecked&sort_type=asc"

    // const reqProxy = await axios.get(urlProxy);

    // const proxyId = reqProxy.data?.data?.filter((e: any) => e.country === "ID");

    // // console.log(proxyId);

    // // return;

    // const length = parseInt(proxyId.length);

    // const proxyRandomize = proxyId[Math.floor(Math.random() * length)];

    // // console.log(proxyRandomize)

    // // return;
    // // return;

    // // const proxyData = reqProxy.data;

    // // let setProxy = false;
    // let proxySelected = `${proxyRandomize?.protocols[0]}://${proxyRandomize?.ip}:${proxyRandomize?.port}`;

    // console.log(proxySelected, proxyRandomize)

    // return;

    // if (proxyData?.data && proxyData?.data?.length > 0) {
    //   proxySelected = proxyData.data[0];
    //   setProxy = true;
    // }

    if (this.isModeAwsLambda) {
      this.engine = "playwright-aws-lambda";
      this.playwright = require("playwright-aws-lambda");
      this.browser = await this.playwright.launchChromium();
    } else {
      this.engine = "playwright";
      this.playwright = require("playwright");

      this.browser = await this.playwright?.chromium.launch({
        headless: true,
      });
    }

    const userAgent = new UserAgent();

    // if (setProxy) {
      this.context = await this.browser.newContext({
        bypassCSP: true,
        userAgent: userAgent.toString(),
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        javaScriptEnabled: true,
        // proxy: {
        //   server: proxySelected
        // }
      });
    // } else {
    //   this.context = await this.browser.newContext({
    //     bypassCSP: true,
    //     userAgent: userAgent.toString(),
    //     viewport: { width: 1920, height: 1080 },
    //     ignoreHTTPSErrors: true,
    //     javaScriptEnabled: true
    //   });
    // }

    this.page = await this.context.newPage();

    await this.page.route("**/*", (route: any) => {
      if (
        route
          .request()
          .resourceType()
          // .match(/^(image|script|stylesheet|font|other)/)
          .match(/^(image|font|other)/)
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
          // console.log(route.request().resourceType(), route.request().url());
          return route.continue();
        }
      }
    });

    try {

      const networkPromise = new Promise((resolve) => {
        this.page.on('response', async (response) => {
          const checkUrl = response.url();
          if (checkUrl.includes("api/egold/v2/gold/price")) {
            const promiseNetworkData = await response.json();

            resolve(promiseNetworkData);
          }
        });
      });

      await this.page.goto(this.site.url);

      if (!("onNetwork" in this.site)) {
        this.content = await this.page.content();

        await this.page.evaluate(() => {
          window.scrollBy(0, window.innerHeight);
        });

        if (this.checkIfSelectorIsArray()) {

          // await this.site.selector.forEach(async (el: any) => {
          //   const rate: Rate = await this.getFromElement(el);
          //   this.data.push(rate);
          // });
          for (const el of this.site.selector) {
            const rate: Rate = await this.getFromElement(el);
            this.data.push(rate);
          }

          // await this.page.waitForLoadState("networkidle"); // This resolves after 'networkidle'

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
      } else {
        const scrapedData = await networkPromise;
        return {
          data: [
            {
              type: this.site.selector[0].type,
              buy: get(scrapedData, this.site.selector[0].buy),
              sell: get(scrapedData, this.site.selector[0].sell),
              weight: 1,
              unit: "gram",
              info: get(scrapedData, this.site.selector[0].info),
            }
          ],
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

    if (selector?.sell != null) {
      rate.sell = get(objectValue, selector?.sell);
    } else {
      rate.sell = null;
    }


    return this.checkWithFormatter(rate);
  }

  private async getFromElement(selector: any) {
    const rate: Rate = this.createRateFromSelector(selector);

    if ("before" in selector) {
      if ("click" in selector.before) {

        // console.log(`"click" in selector.before`)


        if ("ignoreWhenVisible" in selector.before.click) {
          const element = await this.page.$(selector.before.click.ignoreWhenVisible);

          // console.log("element", element);

          if (!element) {
            this.page.click(selector.before.click.on);
          }
        } else {
          // console.log("click")
          this.page.click(selector.before.click.on);
        }

      }
    }

    if (this.checkBuyAndSellSelector(selector)) {
      if (selector?.sell != null) {
        await this.page.waitForSelector(selector.sell, { timeout: 10000 }); // Menunggu maksimal 10 detik
        rate.sell = await this.page.$eval(selector.sell, (e: any) =>
          e.innerText?.trim()
        );
      }


      if (selector?.buy != null) {
        await this.page.waitForSelector(selector.buy, { timeout: 10000 }); // Menunggu maksimal 10 detik
        rate.buy = await this.page.$eval(selector.buy, (e: any) => {

            // console.log(e)
            return e.innerText?.trim()
          }
        );
      }

      if (selector?.info != null) {
        await this.page.waitForSelector(selector.info, { timeout: 10000 }); // Menunggu maksimal 10 detik
        rate.info = await this.page.$eval(selector.info, (e: any) => {

          // console.log(e)
          return e.innerText?.trim()
        }
        );
      }

      if (selector?.weight) {
        await this.page.waitForSelector(selector.weight, { timeout: 10000 }); // Menunggu maksimal 10 detik

        rate.weight = await this.page.$eval(selector.weight, (e: any) => {
            // console.log(e)
            return e.innerText?.trim()
          }
        );


        if (selector?.formatter) {
          if ("weight" in selector.formatter) {
            rate.weight = selector.formatter.weight(rate.weight);
          }
        }

        rate.weight = parseFloat(rate.weight as any);
      }

    }

    return this.checkWithFormatter(rate);
  }

  private getValueFromDom(dom: any, selector: any) {
    if (this.checkBuyAndSellSelector(selector)) {
      const $ = cheerio.load(dom);

      const rate: Rate = this.createRateFromSelector(selector);
      rate.buy = $(selector.buy).text();
      rate.sell = $(selector.sell).text();

      if ("info" in selector) {
        rate.info = $(selector.info).text();
      }

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
      info: null,
      weight: null,
      unit: "gram",
    };
  }

  async scrape(site: string) {
    if (!(site in siteDefiner)) {
      throw new BadRequestException(
        `there is no ${site} registered on definer`
      );
    }

    this.site = siteDefiner[site];
    this.siteName = site;

    this.data = [];

    const isOnMirror = "mirror" in this.site;

    const parseBoolean = (value) => {
      if (typeof value === "boolean") {
        return value;
      }
      if (typeof value === "string") {
        value = value.toLowerCase();
        return value === "true" || value === "yes" || value === "1";
      }
      return !!value; // Default fallback
    }

    // if (isOnMirror && this.useMirror) {
    if (isOnMirror && parseBoolean(this.useMirror)) {
      return await this.scrapeOnMirror();
    } else {
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
}
