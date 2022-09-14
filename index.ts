import { appHandler } from './handlers/app.handler';
import express, { Express } from "express";
import dotenv from "dotenv";

const app: Express = express();
const port = 3000;

const AWS_LAMBDA_FUNCTION = (process.env.AWS_LAMBDA_FUNCTION == "true") || false;


app.get("/", appHandler.getHome);

app.get("/prices", (req, res) => {
    const avail = ["anekalogam", "logammulia"];
    const site = req.query?.site;
      if (avail.includes(`${site}`)) {
        scrape(req.query).then((_content) => {
          res.json(_content);
        });
    } else {
          res.json({
            data: null,
            meta: {
              message: site ? "site not in list" : "site cannot empty",
            },
          });
      }
});

async function scrape(query?:any) {
    let browser;
    let engine;
    let context;
    let body;

    const siteMap: any = {
      anekalogam: {
        url: "https://www.anekalogam.co.id/id",
        selector: {
          sell: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice",
          buy: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice",
        },
      },
      logammulia: {
        url: "https://www.logammulia.com/id/harga-emas-hari-ini",
        selector: {
          sell: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(2)",
          buy: null,
        },
      },
    };

    try {

        if (!AWS_LAMBDA_FUNCTION) {
            const playwright = require('playwright');

            engine = "playwright";

            browser = await playwright.chromium.launch({
                headless: false, // Show the browser.
            });

        } else {
            const playwright = require('playwright-aws-lambda');
            engine = "playwright-aws-lambda";
            browser = await playwright.launchChromium();
        }

        context = await browser.newContext({
            bypassCSP: true,
        });

        const page = await context.newPage();

        await page.route("**/*", (route: any) => {
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
                  .match(/https?:\/\/.*youtube.*/)
              ) {
                return route.abort();
              } else {
                console.log(
                  route.request().resourceType(),
                  route.request().url()
                );
                return route.continue();
              }
            }
        })

      await page.goto(siteMap[query?.site].url);

      await page.waitForLoadState("networkidle");
      // body = await page.body();

        let rate: any = {
          sell: 0,
          buy: 0,
          type: 'antam'
        };

        if (siteMap[query?.site]?.selector?.sell) {
          rate.sell = await page.$eval(
            siteMap[query?.site].selector.sell,
            (e: any) =>
              e.innerText
                .trim()
                .replace(/[,.]00$/, "")
                .replace(/([a-zA-Z\/\s\.\,])*/g, "")
          );
        }

        if (siteMap[query?.site]?.selector?.buy) {
            rate.buy = await page.$eval(
              siteMap[query?.site].selector.buy,
              (e: any) => e.innerText.trim()
                .replace(/[,.]00$/, "")
                .replace(/([a-zA-Z\/\s\.\,])*/g, "")
            );
        }

        await browser.close();

        rate.sell = parseInt(rate.sell);
        rate.buy = parseInt(rate.buy);

        console.log({ rate });

        const { url, name } = siteMap[query?.site];

        return { data: { rate }, meta: { engine, site: { url, name } } };
    } catch (e) {
        if(browser != null) {
            await browser.close();
        }
        console.error(e)
        return { data: null, meta: { engine, error: (e as any)?.message , body } };
    }
}

dotenv.config();

const mysql = require("mysql2");

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "test",
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(port, () => console.log(`app running on http://localhost:${port}`));
