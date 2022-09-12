// const express = require('express');
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

// let playwright;

const app: Express = express();
const port = 3000;

const AWS_LAMBDA_FUNCTION = (process.env.AWS_LAMBDA_FUNCTION == "true") || false;


app.get("/", (req, res) => {
    res.json({
        message: 'welcome to logam mulia api',
        data: {
            requestId: new Date().getTime(),
            awsLambdaFunction: AWS_LAMBDA_FUNCTION,
            engine: AWS_LAMBDA_FUNCTION ? "playwright-aws-lambda" : "playwright"
        },
        meta: {
            auth: {
                state: false
            },
            availablePath: [
                {
                    "method": "get",
                    "path": "prices",
                    "params": {
                        "site": "anekalogam|etc"
                    },
                },
                {
                    "method": "get",
                    "path": "sites",
                }
            ]
        }
    });
});

app.get("/prices", (req, res) => {
    scrape().then((_content) => {
        res.json(_content);
    });
});

async function scrape() {
    let scraper;
    let browser;
    let engine;
    let context;

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

        await page.goto('https://www.anekalogam.co.id/id');

        let antam : any= {};

        antam.sell = await page.$eval('body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice', (e : any) => parseFloat(e.innerText.trim().replace(".", "")));
        antam.buy = await page.$eval('body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice', (e: any) => parseFloat(e.innerText.trim().replace(".", "")));

        await browser.close();

        console.log({ antam })
        return { data: { antam }, meta: { engine, site: { name: "anekalogam", url: "https://www.anekalogam.co.id/id"} } };
    } catch (e) {
        if(browser != null) {
            await browser.close();
        }
        console.error(e)
        return { data: null, meta: {engine} };
    }
}

app.listen(port, () => console.log(`http://localhost:${port}`));
