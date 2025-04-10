export default {
    anekalogam: {
        url: "https://www.anekalogam.co.id/id",
        engine: "cheerio",
        selector: [
            {
                // sell: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice",
                sell: "#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(1) > div > p > span",
                // buy: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice",
                buy: "#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(2) > div > p > span",
                type: "antam",
                info: "#today-price > div.section-intro > p:nth-child(3)"
            },
        ],
    }
}