export const siteDefiner = {
  anekalogam: {
    url: "https://www.anekalogam.co.id/id",
    engine: "cheerio",
    selector: [
      {
        sell: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(2) > div > p > span.tprice",
        buy: "body > div.grouped-section > section:nth-child(2) > div > div > div.grid-child.n-768-1per3.n-992-2per5 > div > div:nth-child(1) > div > p > span.tprice",
        type: "antam",
      },
    ],
  },
  logammulia: {
    url: "https://www.logammulia.com/id/harga-emas-hari-ini",
    error: "blocked by cloudflare protection",
    engine: "playwright",
    selector: [
      {
        type: "antam",
        sell: "body > section.section-padding.n-no-padding-top > div > div:nth-child(3) > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(2)",
        buy: null,
      },
    ],
  },
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
  tokopedia: {
    url: "https://www.tokopedia.com/emas/harga-hari-ini/",
    error: "request timeout",
    engine: "cheerio",
    selector: [
      {
        type: "pegadaian",
        sell: "#content > div > div > div.css-9tp5oi > div.todays-price__body > div.left > table > thead > tr > td:nth-child(1) > p:nth-child(2) > span",
        buy: "#content > div > div > div.css-9tp5oi > div.todays-price__body > div.left > table > thead > tr > td:nth-child(2) > p:nth-child(2) > span",
      },
    ],
  },
  pegadaian: {
    url: "https://www.pegadaian.co.id/harga",
    engine: "cheerio",
    selector: [
      {
        sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(2)",
        buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(2)",
        type: "antam",
      },
      {
        sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(3)",
        buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(3)",
        type: "antam-retro",
      },
      {
        sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(4)",
        buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(4)",
        type: "antam-batik",
      },
      {
        sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(5)",
        buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(5)",
        type: "ubs",
      },
    ],
  },
  sakumas: {
    url: "https://sakumas.com/",
    engine: "cheerio",
    selector: [
      {
        type: "sakumas",
        sell: "#hargaBeli",
        buy: "#hargaJual",
      },
    ],
  },
  semar: {
    engine: "axios",
    url: "https://goldprice.semar.co.id/home/multi/smg_press/smg",
    selector: [
      {
        type: "smg-press",
        sell: "header.smg_press.price",
        buy: "header.smg_press.buyback_price",
      },
      {
        type: "smg-non-press",
        sell: "header.smg.price",
        buy: "header.smg.buyback_price",
      },
    ],
  },
  koinworks: {
    engine: "cheerio",
    url: "https://koinworks.com/harga-emas-hari-ini/",
    selector: [
      {
        type: "antam",
        sell: "body > div.elementor.elementor-44095 > section.elementor-section.elementor-top-section.elementor-element.elementor-element-ffc266a.elementor-section-boxed.elementor-section-height-default.elementor-section-height-default > div > div > div > div > div > div > table > tbody > tr:nth-child(3) > td:nth-child(2)",
        buy: null,
      },
    ],
  },
  kursdolar: {
    engine: "cheerio",
    url: "http://kurs.dollar.web.id/harga-emas-hari-ini.php",
    selector: [
      {
        type: "emas",
        sell: "#main > div > div:nth-child(7) > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(3)",
        buy: "#main > div > div:nth-child(7) > table:nth-child(1) > tbody > tr:nth-child(2) > td:nth-child(2)",
      },
      {
        type: "bsi",
        sell: "#main > div > div:nth-child(7) > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(3)",
        buy: "#main > div > div:nth-child(7) > table:nth-child(6) > tbody > tr:nth-child(2) > td:nth-child(2)",
      },
    ],
  },
  cermati: {
    engine: "cheerio",
    url: "https://www.cermati.com/artikel/harga-emas-hari-ini",
    selector: [
      {
        type: "emas",
        sell: "#parent-node > div:nth-child(4) > table > tbody > tr > td:nth-child(2) > h5 > span",
        buy: null,
      },
      {
        type: "antam",
        sell: "#parent-node > div:nth-child(4) > table > tbody > tr > td:nth-child(3) > h5",
        buy: null,
      },
    ],
  },
  bsi: {
    engine: "playwright",
    url: "https://www.bankbsi.co.id/",
    selector: [
      {
        type: "emas",
        sell: "#wrapper-data-gold-1 > div:nth-child(1) > div:nth-child(2) > p",
        buy: "#wrapper-data-gold-1 > div:nth-child(1) > div:nth-child(3) > p",
      },
    ],
  },
  brankaslm: {
    engine: "playwright",
    url: "https://www.brankaslm.com/antam/index",
    selector: [
      {
        type: "brankaslm-personal",
        sell: "body > div.container > div > div:nth-child(1) > div > div > div > div.col-lg-8.col-md-8.col-xs-12 > table > tbody > tr:nth-child(1) > td:nth-child(2)",
        buy: "body > div.container > div > div:nth-child(1) > div > div > div > div.col-lg-8.col-md-8.col-xs-12 > table > tbody > tr:nth-child(2) > td:nth-child(2)",
      },
      {
        type: "brankaslm-korporat",
        sell: "body > div.container > div > div:nth-child(1) > div > div > div > div.col-lg-8.col-md-8.col-xs-12 > table > tbody > tr:nth-child(1) > td:nth-child(3)",
        buy: "body > div.container > div > div:nth-child(1) > div > div > div > div.col-lg-8.col-md-8.col-xs-12 > table > tbody > tr:nth-child(2) > td:nth-child(3)",
      },
    ],
  },
  indogold: {
    engine: "cheerio",
    url: "https://www.indogold.id/harga-emas-hari-ini",
    selector: [
      {
        type: "antam",
        sell: "#tab3 > table > tbody > tr:nth-child(3) > td:nth-child(2) > strong",
        buy: "#tab3 > table > tbody > tr:nth-child(3) > td:nth-child(3) > strong",
      },
      {
        type: "lotus-archi-merah-putih",
        sell: "#tab2 > table > tbody > tr:nth-child(10) > td:nth-child(3) > strong",
        buy: "#tab2 > table > tbody > tr:nth-child(10) > td:nth-child(4) > strong",
      },
      {
        type: "ubs",
        sell: "#tab0 > table > tbody > tr:nth-child(5) > td:nth-child(2) > strong",
        buy: "#tab0 > table > tbody > tr:nth-child(5) > td:nth-child(3) > strong",
      },
    ],
  },
  "hargaemas-net": {
    engine: "cheerio",
    url: "https://harga-emas.net/",
    formatter: {
      buy: (e: any) => {
        const params = e?.trim()?.replace(/\,0/, "");

        return e ? parseInt(`${params}000`) : 0;
      },
      sell: (e: any) => {
        const params = e?.trim()?.replace(/\,0/, "");

        return e ? parseInt(`${params}000`) : 0;
      },
    },
    selector: [
      {
        type: "antam",
        sell: "body > div.container > div:nth-child(2) > div.eight.columns > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(3)",
        buy: null,
      },
      {
        type: "pegadaian",
        sell: "body > div.container > div:nth-child(2) > div.eight.columns > table:nth-child(2) > tbody > tr:nth-child(1) > td:nth-child(5)",
        buy: null,
      },
    ],
  },
  inbizia: {
    engine: "cheerio",
    url: "https://www.inbizia.com/harga-emas-hari-ini-287964",
    selector: [
      {
        type: "logam-mulia",
        sell: "#content > table.table.table-data.hide-mob > tbody > tr:nth-child(3) > td:nth-child(2)",
        buy: null,
      },
    ],
  },
  "hargaemas-com": {
    engine: "cheerio",
    url: "https://www.hargaemas.com/",
    selector: [
      {
        type: "antam",
        sell: "body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(2) > div.price-current",
        buy: "body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(1) > div.price-current",
      },
    ],
  },
};
