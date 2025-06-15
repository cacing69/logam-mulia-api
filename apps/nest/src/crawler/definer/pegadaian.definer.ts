export default {
    pegadaian: {
        url: "https://www.pegadaian.co.id/",
        engine: "playwright",
        mirror: true,
        selector: [
            {
                before: {
                    click: {
                        on: "#ubs-tab",
                        ignoreWhenVisible: "#ubs"
                    },
                },
                type: "ubs",
                info: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__right > h5 > span.date-desc",
                // buy: "#root > div.landing-page > div.landing-page-menu-promo > div > div > div.gold-section-box__left > div > h1",
                // buy: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__left > p",
                buy: "#ubs > div > div > table > tbody > tr:nth-child(1) > td.text-left.black-zero",
                // sell: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__right > div > div:nth-child(1) > p",
                sell: null,
                weight: "#ubs > div > div > table > tbody > tr:nth-child(1) > td:nth-child(1)",
                unit: "gram",
                formatter: {
                    weight: (e: string) => {
                        return e.replace(/[^0-9.]/g, '');
                    }
                }
            },
            {
                before: {
                    // click: "#ubs-tab",
                    click: {
                        on: "#ubs-tab",
                        ignoreWhenVisible: "#ubs"
                    }
                },
                type: "ubs",
                // buy: "#root > div.landing-page > div.landing-page-menu-promo > div > div > div.gold-section-box__left > div > h1",
                // buy: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__left > p",
                buy: "#ubs > div > div > table > tbody > tr:nth-child(2) > td.text-left.black-zero",
                // sell: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__right > div > div:nth-child(1) > p",
                sell: null,
                info: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__right > h5 > span.date-desc",
                weight: "#ubs > div > div > table > tbody > tr:nth-child(2) > td:nth-child(1)",
                unit: "gram",
                formatter: {
                    weight: (e: string) => {
                        return e.replace(/[^0-9.]/g, '');
                    }
                }
            },
            // {
            //     type: "tabungan_emas",
            //     // buy: "#root > div.landing-page > div.landing-page-menu-promo > div > div > div.gold-section-box__left > div > h1",
            //     // buy: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__left > p",
            //     buy: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__left > p",
            //     // sell: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__right > div > div:nth-child(1) > p",
            //     sell: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__right > div > div:nth-child(1) > p",
            //     info: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div:nth-child(1) > div.title-box > span > b",
            //     weight: "#root > div.landing-page > div.landing-page-gold-section > div.body > div.gold-section-box > div.gold-section-box__left > div.gold-section-box__left-top > div.box-jual-beli > div.box-jual-beli__left > p > span",
            //     unit: "gram",
            //     formatter: {
            //         buy: (e: string) => {
            //             return e.replace(/[^0-9.]/g, '');
            //         }
            //     }
            // },
        ]
    },
}