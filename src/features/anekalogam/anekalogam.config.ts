import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const anekalogamConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	active: true,
	items: [
		{
			url: 'https://www.anekalogam.co.id/id',
			selector: {
				sell: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(1) .tprice',
				buy: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(2) .tprice',
				type: raw('antam'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
			},
		},
		// Contoh tambah item dengan URL berbeda:
		// {
		//   url: 'https://www.anekalogam.co.id/ubs',
		//   selector: {
		//     sell: '.sell-price',
		//     buy: '.buy-price',
		//     type: raw('UBS'),
		//     info: '.product-info'
		//   }
		// }
	],
};
