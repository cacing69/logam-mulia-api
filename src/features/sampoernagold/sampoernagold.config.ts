import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const sampoernagoldConfig: ScrapingConfig<'price' | 'buybackPrice' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://sampoernagold.com/',
	active: true,
	items: [
		{
			selector: {
				price: '#content > div > div.bg-gradient-grey > div > div.kurs-gold-area.row > div.col-xl-5.col-lg-6.col-md-6.col-12 > table > tbody > tr:nth-child(3) > td:nth-child(2)',
				buybackPrice: '#content > div > div.bg-gradient-grey > div > div.kurs-gold-area.row > div.col-xl-5.col-lg-6.col-md-6.col-12 > table > tbody > tr:nth-child(3) > td:nth-child(3)',
				type: raw('sampoernagold'),
				info: '#content > div > div.bg-gradient-grey > div > div.heading-block.text-center > h3',
			},
		},
	],
};
