import type { ScrapingConfig } from '../../lib/types';

export const sakumasConfig: ScrapingConfig<'buybackPrice' | 'sellPrice'> = {
	name: 'sakumas',
	displayName: 'Sakumas',
	logo: '',
	urlHomepage: 'https://sakumas.asastapayment.com',
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
