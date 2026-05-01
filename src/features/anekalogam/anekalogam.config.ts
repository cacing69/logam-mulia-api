import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const anekalogamConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'material' | 'materialType' | 'weight' | 'weightUnit' | 'info'> = {
	name: 'anekalogam',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.anekalogam.co.id/id',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(1) .tprice',
				sellPrice: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(2) .tprice',
				material: raw('gold'),
				materialType: raw('Logam Mulia ANTAM Certicard Gramasi 100'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(1),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(1),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(2),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(3),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(5),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(10),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(25),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(50),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: raw('LM Antam produksi tahun 2026'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(100),
				weightUnit: raw('gr'),
			},
		},
	],
};
