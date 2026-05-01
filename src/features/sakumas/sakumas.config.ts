import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const sakumasConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://sakumas.asastapayment.com/',
	active: true,
	items: [
		{
			selector: {
				sell: '#hargaJual',
				buy: '#hargaBeli',
				type: raw('sakumas'),
				info: '.hargaEmasContainer .hargaTitle',
			},
		},
	],
};
