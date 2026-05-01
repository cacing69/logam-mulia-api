import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hartadinataabadiConfig: ScrapingConfig<'price' | 'buybackPrice' | 'type'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://hartadinataabadi.co.id/',
	active: true,
	items: [
		{
			selector: {
				price: '#index > div > div:nth-child(2) > div.who-we-are > div > div.consume > div.flex.widget-panel > div.widget-box.price-widget > a > div.price',
				buybackPrice: raw(null), // No sell price available, set as empty string
				type: raw('hartadinataabadi'),
			},
		},
	],
};
