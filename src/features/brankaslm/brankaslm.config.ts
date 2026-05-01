import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const brankaslmConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://brankaslm.com/dashboard',
	active: false,
	items: [
		{
			selector: {
				sell: '#dashboard-welcome-wrapper > div.container-dashboard-brankas > div > div.col-sm-7.col-md-6.col-12 > section > div.row.price-card.px-4 > div.col.col-5.pl-4 > div:nth-child(3)',
				buy: raw(null),
				type: raw('emas fisik'),
				info: 'title',
			},
		},
	],
};
