import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const sakumasConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'type' | 'info'> = {
	name: 'sakumas',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://sakumas.asastapayment.com/',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#hargaJual',
				sellPrice: '#hargaBeli',
				type: raw('sakumas'),
				info: '.hargaEmasContainer .hargaTitle',
			},
		},
	],
};
