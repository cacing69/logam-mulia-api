import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const bankbsiConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info' | 'weight'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://translate.google.com/translate?sl=id&tl=en&u=https://www.bankbsi.co.id/',
	active: true,
	items: [
		{
			selector: {
				buy: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(2) p',
				sell: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(3) p',
				weight: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(1)',
				type: raw('bankbsi'),
				info: 'title',
			},
		},
	],
};
