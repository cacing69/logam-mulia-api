import { appHandler } from './handlers/app.handler';
import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port = 3000;

const AWS_LAMBDA_FUNCTION = (process.env.AWS_LAMBDA_FUNCTION == "true") || false;


app.get("/", appHandler.getHome);

app.get("/prices", (req, res) => {
    const avail = ['anekalogam'];
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

    const siteMap: any = {
      anekalogam: {
        url: "https://www.anekalogam.co.id/id",
        selector: {
          sell: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice",
          buy: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice",
        },
      },
      logammulia: {
        url: "https://www.logammulia.com/id",
        selector: {
          sell: "body > section.index-hero > div.hero-price > div.child.child-2.has-bg.has-overlay.overlay-gold > div > p.price > span.current",
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
            const blockReq = ['image', 'script', 'stylesheet', 'font', 'other'];
            if (blockReq.includes(route.request().resourceType())) {
                return route.abort();
            } else {
                if (route.request().url().match(/https?:\/\/.*youtube.*/)) {
                    return route.abort();
                } else {
                    console.log(route.request().resourceType(), route.request().url())
                    return route.continue();
                }
            }
        })

        await page.goto(siteMap[query?.site].url);

        let antam: any = {
            sell: 0,
            buy: 0,
        };


        if (siteMap[query?.site]?.selector?.sell) {
          antam.sell = await page.$eval(
            siteMap[query?.site].selector.sell,
            (e: any) =>
              e.innerText
                .trim()
                .replace(/[,.]00$/, "")
                .replace(/([a-zA-Z\/\s|\.\,])*/g, "")
          );
        }

        if (siteMap[query?.site]?.selector?.buy) {
            antam.buy = await page.$eval(
            siteMap[query?.site].selector.buy,
            (e: any) => e.innerText.trim().replace(/\w/, "")
            );
        }

        await browser.close();

        antam.sell = parseInt(antam.sell);
        antam.buy = parseInt(antam.buy);

        console.log({ antam })

        const { url, name } = siteMap[query?.site];

        return { data: { antam }, meta: { engine, site: {url, name}} };
    } catch (e) {
        if(browser != null) {
            await browser.close();
        }
        console.error(e)
        return { data: null, meta: {engine} };
    }
}
// scrape({site:"logammulia"});
app.listen(port, () => console.log(`http://localhost:${port}`));
