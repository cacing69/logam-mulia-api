export default {
    inbizia: {
        engine: "cheerio",
        url: "https://www.inbizia.com/harga-emas-hari-ini-287964",
        selector: [
            {
                type: "logam-mulia",
                sell: "#content > table.table.table-data.hide-mob > tbody > tr:nth-child(2) > td:nth-child(2)",
                buy: null,
                info: null,
                weight: 1,
                unit: "gram",
            },
        ],
    },
}