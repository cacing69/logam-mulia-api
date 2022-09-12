"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const express = require('express');
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// let playwright;
const app = (0, express_1.default)();
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
function scrape() {
    return __awaiter(this, void 0, void 0, function* () {
        let scraper;
        let browser;
        let engine;
        let context;
        try {
            if (!AWS_LAMBDA_FUNCTION) {
                const playwright = require('playwright');
                engine = "playwright";
                browser = yield playwright.chromium.launch({
                    headless: false, // Show the browser.
                });
            }
            else {
                const playwright = require('playwright-aws-lambda');
                engine = "playwright-aws-lambda";
                browser = yield playwright.launchChromium();
            }
            context = yield browser.newContext({
                bypassCSP: true,
            });
            const page = yield context.newPage();
            yield page.route("**/*", (route) => {
                const blockReq = ['image', 'script', 'stylesheet', 'font', 'other'];
                if (blockReq.includes(route.request().resourceType())) {
                    return route.abort();
                }
                else {
                    if (route.request().url().match(/https?:\/\/.*youtube.*/)) {
                        return route.abort();
                    }
                    else {
                        console.log(route.request().resourceType(), route.request().url());
                        return route.continue();
                    }
                }
            });
            yield page.goto('https://www.anekalogam.co.id/id');
            let antam = {};
            antam.sell = yield page.$eval('body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice', (e) => parseFloat(e.innerText.trim().replace(".", "")));
            antam.buy = yield page.$eval('body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice', (e) => parseFloat(e.innerText.trim().replace(".", "")));
            yield browser.close();
            console.log({ antam });
            return { data: { antam }, meta: { engine, site: { name: "anekalogam", url: "https://www.anekalogam.co.id/id" } } };
        }
        catch (e) {
            if (browser != null) {
                yield browser.close();
            }
            console.error(e);
            return { data: null, meta: { engine } };
        }
    });
}
app.listen(port, () => console.log(`http://localhost:${port}`));
