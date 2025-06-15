export default {
    tokopedia: {
        url: "https://www.tokopedia.com/emas/harga-hari-ini/",
        error: "request timeout",
        engine: "playwright",
        mirror: true,
        onNetwork: true,
        selector: [
            {
                type: "e_gold",
                sell: "data.sell_price",
                buy: "data.buy_price",
                weight: 1,
                unit: "gram",
                info: "data.date",
            },
        ],
    },
}