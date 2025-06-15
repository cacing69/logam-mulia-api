export default {
    logammulia: {
        url: "https://www.logammulia.com/id/harga-emas-hari-ini",
        // error: "blocked by cloudflare protection",
        mirror: true,
        engine: "playwright",
        selector: [
            {
                type: "emas_batangan",
                sell: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(2)",
                buy: null,
                info: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(2) > th",
                weight: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(3) > td:nth-child(1)",
                formatter: {
                    weight: (e: string) => {
                        return e.replace(/[^0-9.]/g, '');
                    }
                }
            },
            {
                type: "emas_batangan",
                sell: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(2)",
                buy: null,
                info: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(2) > th",
                weight: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > div > div.grid-child.n-768-1per3.n-768-no-margin-bottom > table:nth-child(4) > tbody > tr:nth-child(4) > td:nth-child(1)",
                formatter: {
                    weight: (e: string) => {
                        return e.replace(/[^0-9.]/g, '');
                    }
                }
            },
        ],
    },
}