import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const sakumasConfig: ScrapingConfig<'buybackPrice' | 'price' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://sakumas.asastapayment.com/',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#hargaJual',
				price: '#hargaBeli',
				type: raw('sakumas'),
				info: '.hargaEmasContainer .hargaTitle',
			},
		},
	],
};
