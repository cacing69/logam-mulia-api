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
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import http from 'http';
import https from 'https';

interface Rate {
  buy: string | number;
  sell: string | number;
  type: string;
  info: string;
  weight: string| number;
  unit: string;
}

interface CircuitBreakerState {
  failures: number;
  lastFailure: Date | null;
  state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
}

interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
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
  
  // Circuit breaker state for each URL
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.isModeAwsLambda = this.configService.get("APP_AWS_LAMBDA_FUNCTION");
    this.isHeadless = this.configService.get("APP_HEADLESS");
    this.useMirror = this.configService.get("APP_USE_MIRROR");
    this.urlMirror = this.configService.get("APP_MIRROR_URL");
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getRandomUserAgent(): string {
    try {
      // Generate a random, realistic User-Agent string
      // Use broader filter or no filter to ensure we get a user agent
      const userAgent = new UserAgent();
      return userAgent.toString();
    } catch (error: any) {
      // Fallback to a default user agent if generation fails
      console.warn('Failed to generate random user agent, using fallback:', error?.message || error);
      return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36';
    }
  }

  private getBrowserSpecificHeaders(userAgent: string): Record<string, string> {
    // Use simpler, more universal headers that work with most APIs
    return {
      'User-Agent': userAgent,
      'Accept': 'application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
  }

  private getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  private getHumanLikeDelay(): number {
    // Generate more human-like delays between requests
    // Most humans take 1-3 seconds between actions, with occasional longer pauses
    const patterns = [
      { min: 1000, max: 2000, weight: 60 }, // 60% chance: 1-2 seconds
      { min: 2000, max: 3000, weight: 25 }, // 25% chance: 2-3 seconds  
      { min: 3000, max: 5000, weight: 10 }, // 10% chance: 3-5 seconds
      { min: 5000, max: 8000, weight: 5 }   // 5% chance: 5-8 seconds
    ];
    
    const random = Math.random() * 100;
    let cumulative = 0;
    
    for (const pattern of patterns) {
      cumulative += pattern.weight;
      if (random <= cumulative) {
        return this.getRandomDelay(pattern.min, pattern.max);
      }
    }
    
    // Fallback
    return this.getRandomDelay(1000, 2000);
  }

  private getCircuitBreakerState(url: string): CircuitBreakerState {
    if (!this.circuitBreakers.has(url)) {
      this.circuitBreakers.set(url, {
        failures: 0,
        lastFailure: null,
        state: 'CLOSED'
      });
    }
    return this.circuitBreakers.get(url)!;
  }

  private updateCircuitBreakerOnSuccess(url: string): void {
    const state = this.getCircuitBreakerState(url);
    state.failures = 0;
    state.lastFailure = null;
    state.state = 'CLOSED';
  }

  private updateCircuitBreakerOnFailure(url: string): void {
    const state = this.getCircuitBreakerState(url);
    state.failures++;
    state.lastFailure = new Date();
    
    if (state.failures >= 3) {
      state.state = 'OPEN';
    }
  }

  private isCircuitBreakerOpen(url: string): boolean {
    const state = this.getCircuitBreakerState(url);
    
    if (state.state === 'CLOSED') {
      return false;
    }
    
    if (state.state === 'OPEN') {
      // Check if enough time has passed to try again (5 minutes)
      const timeSinceLastFailure = Date.now() - (state.lastFailure?.getTime() || 0);
      if (timeSinceLastFailure > 5 * 60 * 1000) {
        state.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    
    // HALF_OPEN state allows one attempt
    return false;
  }

  // Public method to get circuit breaker status for monitoring
  getCircuitBreakerStatus(): Map<string, CircuitBreakerState> {
    return new Map(this.circuitBreakers);
  }

  // Public method to reset circuit breaker for a specific URL
  resetCircuitBreaker(url: string): void {
    if (this.circuitBreakers.has(url)) {
      const state = this.circuitBreakers.get(url)!;
      state.failures = 0;
      state.lastFailure = null;
      state.state = 'CLOSED';
      console.log(`Circuit breaker reset for ${url}`);
    }
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


  async requestWithAxios(url: string, method: string = 'GET', retryConfig?: Partial<RetryConfig>) {
    // Check circuit breaker first
    if (this.isCircuitBreakerOpen(url)) {
      throw new Error(`Circuit breaker is OPEN for ${url}. Service temporarily unavailable.`);
    }

    // Add human-like delay before making request to appear more natural
    const preRequestDelay = this.getHumanLikeDelay();
    console.log(`Adding human-like delay of ${preRequestDelay}ms before request`);
    await this.sleep(preRequestDelay);

    const config: RetryConfig = {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2,
      ...retryConfig
    };

    let lastError: Error;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        const userAgent = this.getRandomUserAgent();
        console.log(`Using User-Agent: ${userAgent.substring(0, 50)}...`);
        const headers = this.getBrowserSpecificHeaders(userAgent);

        const axiosConfig = {
          headers,
          timeout: 15000, // Increased timeout to 15 seconds
          maxRedirects: 5,
          decompress: true,
          responseType: 'text' as const, // Keep as text to handle both JSON and HTML
          validateStatus: (status: number) => status < 500 // Accept 4xx errors but retry on 5xx
        };

        console.log(`Attempt ${attempt}/${config.maxAttempts} for ${url}`);
        
        const res = method === 'POST'
          ? await axios.post(url, {}, axiosConfig)
          : await axios.get(url, axiosConfig);

        // Success - update circuit breaker
        this.updateCircuitBreakerOnSuccess(url);
        console.log(`Request successful for ${url}`);
        return res.data;

      } catch (err: any) {
        lastError = err;
        const axiosErr = err as AxiosError;
        const message = axiosErr.message || '';
        
        console.warn(`Attempt ${attempt} failed for ${url}: ${message}`);

        // Check if this is a retryable error
        const isRetryable = this.isRetryableError(axiosErr);
        
        if (!isRetryable || attempt === config.maxAttempts) {
          // Final failure - update circuit breaker
          this.updateCircuitBreakerOnFailure(url);
          break;
        }

        // Calculate delay with exponential backoff and jitter
        const baseDelay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        );
        const jitter = this.getRandomDelay(0, Math.floor(baseDelay * 0.1));
        const delay = baseDelay + jitter;

        console.log(`Waiting ${delay}ms before retry...`);
        await this.sleep(delay);
      }
    }

    // All retries failed
    const errorMessage = this.getDetailedErrorMessage(lastError as AxiosError, url, config.maxAttempts);
    throw new Error(errorMessage);
  }

  private isRetryableError(error: AxiosError): boolean {
    // Network errors that are worth retrying
    const retryableNetworkErrors = [
      'ECONNRESET',
      'ECONNREFUSED', 
      'ENOTFOUND',
      'ECONNABORTED',
      'ETIMEDOUT',
      'unexpected end of file'
    ];

    const message = error.message?.toLowerCase() || '';
    const code = error.code || '';

    // Check for specific error patterns
    if (retryableNetworkErrors.some(errType => 
      message.includes(errType.toLowerCase()) || code === errType
    )) {
      return true;
    }

    // Check HTTP status codes
    if (error.response?.status) {
      const status = error.response.status;
      // Retry on 5xx errors and some 4xx errors
      return status >= 500 || status === 408 || status === 429;
    }

    return false;
  }

  private getDetailedErrorMessage(error: AxiosError, url: string, maxAttempts: number): string {
    const message = error.message || '';
    const status = error.response?.status;
    const statusText = error.response?.statusText;

    if (message.includes('unexpected end of file')) {
      return `Request failed ${maxAttempts} times due to EOF (End of File) issues for ${url}. This usually indicates network connectivity problems or server-side issues.`;
    }

    if (error.code === 'ECONNRESET') {
      return `Connection was reset by the server ${maxAttempts} times for ${url}. The target server may be overloaded or blocking requests.`;
    }

    if (error.code === 'ETIMEDOUT') {
      return `Request timed out ${maxAttempts} times for ${url}. The server is taking too long to respond.`;
    }

    if (status) {
      return `HTTP ${status} ${statusText} error persisted after ${maxAttempts} attempts for ${url}`;
    }

    return `Request failed ${maxAttempts} times for ${url}: ${message}`;
  }

  // async requestWithAxiosSafe(
  //   url: string,
  //   config: AxiosRequestConfig
  //    = {}
  //   ) {
  //     // Default browser-like headers
  //   const defaultHeaders = {
  //     'User-Agent':
  //       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
  //     'Accept-Encoding': 'gzip, deflate, br',
  //     Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  //     Connection: 'keep-alive',
  //   };

  //   // Keep-alive agents
  //   const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 10 });
  //   const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 });

  //   // Delay helper
  //   const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  //   const mergedConfig: AxiosRequestConfig = {
  //     method: 'GET',
  //     responseType: 'text',
  //     timeout: 10000,
  //     maxRedirects: 5,
  //     decompress: true,
  //     headers: {
  //       ...defaultHeaders,
  //       ...(config.headers || {}),
  //     },
  //     httpAgent,
  //     httpsAgent,
  //     ...config,
  //   };

  //   try {
  //     const response = await axios(url, mergedConfig);
  //     return response.data;
  //   } catch (err: any) {
  //     if (
  //       err.message.includes('unexpected end of file') ||
  //       err.code === 'ECONNRESET'
  //     ) {
  //       console.warn(`[WARN] EOF/Connection reset: retrying ${url} after delay...`);
  //       await wait(1000);
  //       const retryResponse = await axios(url, mergedConfig);
  //       return retryResponse.data;
  //     }

  //     console.error(`[ERROR] Failed to fetch: ${url}`);
  //     throw err;
  //   }
  // }

  async requestWithAxiosSafe(
  url: string,
  config: AxiosRequestConfig = {}
) {
  const defaultHeaders = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept-Encoding': 'gzip, deflate, br',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    Connection: 'keep-alive',
  };

  const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 10 });
  const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 10 });

  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const mergedConfig: AxiosRequestConfig = {
    method: 'GET',
    responseType: 'text',
    timeout: 15000, // sedikit lebih lama
    maxRedirects: 5,
    decompress: true,
    headers: {
      ...defaultHeaders,
      ...(config.headers || {}),
    },
    httpAgent,
    httpsAgent,
    ...config,
  };

  let attempt = 0;
  const maxAttempts = 5;

  while (attempt < maxAttempts) {
    try {
      const response = await axios(url, mergedConfig);
      return response.data;
    } catch (err: any) {
      attempt++;
      const isEOF =
        err.message?.includes('unexpected end of file') ||
        err.code === 'ECONNRESET';

      if (isEOF && attempt < maxAttempts) {
        const delay = 1000 * Math.pow(2, attempt); // exponential backoff
        console.warn(
          `[WARN] Attempt ${attempt} failed with EOF/RESET. Retrying in ${delay}ms...`
        );
        await wait(delay);
        continue;
      }

      console.error(`[ERROR] Failed after ${attempt} attempts: ${url}`);
      throw err;
    }
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

  async scrapeWithCheerioSafe() {
    // Use the improved requestWithAxios instead of requestWithAxiosSafe
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

    console.log('Debug scrapeWithAxios:');
    console.log('- Site config:', { 
      url: this.site?.url, 
      method: method,
      responseType: this.site?.responseType 
    });
    console.log('- Raw requestData type:', typeof requestData);
    console.log('- Raw requestData:', typeof requestData === 'string' ? requestData.substring(0, 500) + '...' : requestData);

    // Parse JSON if the response is a string and expected to be JSON
    let parsedData = requestData;
    
    // Check if this should be parsed as JSON based on definer
    const isJsonResponse = this.site?.responseType === 'json' || 
                          (typeof requestData === 'string' && requestData.trim().startsWith('{'));
    
    if (typeof requestData === 'string' && isJsonResponse) {
      try {
        parsedData = JSON.parse(requestData);
        console.log('- Parsed JSON successfully');
        console.log('- Parsed data structure:', Object.keys(parsedData || {}));
      } catch (e: any) {
        console.log('- Failed to parse JSON:', e?.message || e);
        console.log('- Using raw string data');
      }
    }

    this.content = parsedData;

    if (this.checkIfSelectorIsArray()) {
      this.site?.selector.forEach((e) => {
        const rate = this.getValueFromObj(parsedData, e);
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
    console.log('Debug getValueFromObj:');
    console.log('- objectValue type:', typeof objectValue);
    console.log('- objectValue:', JSON.stringify(objectValue, null, 2));
    console.log('- selector:', JSON.stringify(selector, null, 2));
    
    const rate: Rate = this.createRateFromSelector(selector);

    rate.buy = get(objectValue, selector?.buy);
    rate.sell = get(objectValue, selector?.sell);
    
    console.log('- Extracted buy:', rate.buy);
    console.log('- Extracted sell:', rate.sell);

    if (selector?.info != null) {
      rate.info = get(objectValue, selector?.info);
      console.log('- Extracted info:', rate.info);
    }

    if (selector?.weight != null) {
      if (typeof selector.weight === 'string') {
        rate.weight = get(objectValue, selector.weight);
      } else {
        rate.weight = selector.weight;
      }
      console.log('- Extracted weight:', rate.weight);
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
    console.log(`Starting scrape for site: ${site}`);
    
    if (!(site in siteDefiner)) {
      console.error(`Site ${site} not found in definer`);
      throw new BadRequestException(
        `there is no ${site} registered on definer`
      );
    }

    this.site = siteDefiner[site];
    this.siteName = site;
    this.data = [];

    console.log(`Site configuration loaded:`, {
      engine: this.site?.engine,
      url: this.site?.url,
      hasMirror: "mirror" in this.site
    });

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

    try {
      if (isOnMirror && parseBoolean(this.useMirror)) {
        console.log(`Using mirror for ${site}`);
        return await this.scrapeOnMirror();
      } else {
        if (this.site?.engine) {
          console.log(`Using engine: ${this.site.engine} for ${site}`);
          
          if (this.site.engine == "axios") {
            return await this.scrapeWithAxios();
          } else if (this.site.engine == "cheerio") {
            return await this.scrapeWithCheerio();
          } else if (this.site.engine == "cheerio-safe") {
            return await this.scrapeWithCheerioSafe();
          } else if (this.site.engine == "playwright") {
            return await this.scrapeWithPlaywright();
          }
        } else {
          console.error(`No engine provided for ${site}`);
          throw new BadRequestException('there is no engine provided on definer')
        }
      }
    } catch (error: any) {
      console.error(`Scraping failed for ${site}:`, error?.message || error);
      
      // Check if this is a circuit breaker error
      if (error?.message?.includes('Circuit breaker is OPEN')) {
        throw new BadRequestException(`Service temporarily unavailable for ${site}. Please try again later.`);
      }
      
      // Re-throw the original error for proper handling by error filter
      throw error;
    }
  }
}
