import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const anekalogamConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.anekalogam.co.id/id',
	active: true,
	items: [
		{
			selector: {
				sell: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(1) .tprice',
				buy: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(2) .tprice',
				type: raw('antam'),
				info: '#today-price > div.section-intro > p:nth-child(3)',
			},
		},
	],
};
