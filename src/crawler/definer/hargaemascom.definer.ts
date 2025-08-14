export default {
    "hargaemas-com": {
        engine: "cheerio-safe",
        url: "https://www.hargaemas.com/",
        selector: [
            {
                type: "antam",
                sell: "body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(2) > div.price-current",
                buy: "body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(1) > div.price-current",
            },
        ],
    },
}