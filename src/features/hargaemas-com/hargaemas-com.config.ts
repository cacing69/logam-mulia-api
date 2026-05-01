import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hargaemasComConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.hargaemas.com/',
	active: true,
	items: [
		{
			selector: {
				sell: '.table.table-bordered.table-dark tbody tr:nth-child(2) td:nth-child(1) .price-current',
				buy: '.table.table-bordered.table-dark tbody tr:nth-child(2) td:nth-child(2) .price-current',
				type: raw('antam'),
				info: '.featured-posts .section-title h2',
			},
		},
	],
};
