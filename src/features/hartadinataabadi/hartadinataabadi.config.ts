import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hartadinataabadiConfig: ScrapingConfig<
	'buybackPrice' | 'material' | 'materialType' | 'sellPrice' | 'weight' | 'weightUnit'
> = {
	name: 'hartadinataabadi',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://hartadinataabadi.co.id/',
	active: true,
	items: [
		{
			selector: {
				sellPrice: '#index > div > div:nth-child(2) > div.who-we-are > div > div.consume > div.flex.widget-panel > div.widget-box.price-widget > a > div.price',
				buybackPrice: raw(null), // No buyback price available
				material: raw('gold'),
				materialType: raw('EMASKU'),
				weight: raw(1),
				weightUnit: raw('gr'),
			},
		},
	],
};
