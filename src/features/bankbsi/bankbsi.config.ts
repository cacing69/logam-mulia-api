import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const bankbsiConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://r.jina.ai/https://www.bankbsi.co.id/',
	active: false,
	items: [
		{
			selector: {
				sell: 'body',
				buy: 'body',
				type: raw('bankbsi'),
				info: 'title',
			},
		},
	],
};
