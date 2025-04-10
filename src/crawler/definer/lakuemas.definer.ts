export default {
    lakuemas: {
        url: "https://www.lakuemas.com/harga",
        engine: "cheerio",
        selector: [
            {
                type: "antam",
                sell: "#section1 > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div > h3 > strong",
                buy: "#section1 > div > div > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div > h3 > strong",
            },
        ],
    },
}