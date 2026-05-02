import type { ScrapingConfig } from '../../lib/types/scraper.types';

export const sakumasConfig: ScrapingConfig<'buybackPrice' | 'sellPrice'> = {
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
			},
		},
	],
};
