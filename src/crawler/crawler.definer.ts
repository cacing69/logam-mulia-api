import { format } from 'path';
import anekalogamDefiner from './definer/anekalogam.definer';
import lakuemasDefiner from './definer/lakuemas.definer';
import hargaemasorgDefiner from './definer/hargaemasorg.definer';
import hargaemascomDefiner from './definer/hargaemascom.definer';
import inbiziaDefiner from './definer/inbizia.definer';
import logammuliaDefiner from './definer/logammulia.definer';
import tokopediaDefiner from './definer/tokopedia.definer';
import pegadaianDefiner from './definer/pegadaian.definer';
import treasuryDefiner from './definer/treasury.definer';

export const siteDefiner = {
  ...anekalogamDefiner,
  ...lakuemasDefiner,
  ...hargaemasorgDefiner,
  ...hargaemascomDefiner,
  ...inbiziaDefiner,
  ...logammuliaDefiner,
  ...tokopediaDefiner,
  // pegadaian: {
  //   url: "https://www.pegadaian.co.id/harga",
  //   engine: "cheerio",
  //   selector: [
  //     {
  //       sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(2)",
  //       buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(2)",
  //       type: "antam",
  //     },
  //     {
  //       sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(3)",
  //       buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(3)",
  //       type: "antam-retro",
  //     },
  //     {
  //       sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(4)",
  //       buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(4)",
  //       type: "antam-batik",
  //     },
  //     {
  //       sell: "#nav-harga-emas > div > table > tbody > tr:nth-child(7) > td:nth-child(5)",
  //       buy: "#nav-harga-buyback > div > table > tbody > tr:nth-child(7) > td:nth-child(5)",
  //       type: "ubs",
  //     },
  //   ],
  // },
  ...pegadaianDefiner,
  ...treasuryDefiner,
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
        sell: "#__next > main > div > div.PriceChart_price-chart__latest-price__aFraD",
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
    url: "https://www.indogold.id/detail-emas-batangan",
    selector: [
      {
        type: "antam",
        sell: "#content > div > div:nth-child(1) > div > div:nth-child(3) > p:nth-child(2)",
        buy: "#content > div > div:nth-child(2) > div > div:nth-child(2) > p:nth-child(2)",
        info: "#content > div > div:nth-child(1) > div > div.tw-items-start > p:nth-child(2)"
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
    // formatter: {
    //   buy: (e: any) => {
    //     const params = e?.trim()?.replace(/\,0/, "");

    //     return e ? parseInt(`${params}000`) : 0;
    //   },
    //   sell: (e: any) => {
    //     const params = e?.trim()?.replace(/\,0/, "");

    //     return e ? parseInt(`${params}000`) : 0;
    //   },
    // },
    selector: [
      {
        type: "antam",
        sell: "body > div > div.row > main > div:nth-child(12) > table > tbody > tr:nth-child(2) > td:nth-child(2)",
        buy: null,
      },
    ],
  },
};
