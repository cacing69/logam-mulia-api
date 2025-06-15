export default {
    "hargaemas-org": {
        url: "https://harga-emas.org",
        engine: "cheerio",
        selector: [
            {
                type: "antam",
                sell: "#container > div:nth-child(2) > div > table > tbody > tr:nth-child(4) > td:nth-child(9)",
                buy: "#container > div:nth-child(2) > div > table > tbody > tr:nth-child(4) > td:nth-child(10)",
            },
        ],
    },
}