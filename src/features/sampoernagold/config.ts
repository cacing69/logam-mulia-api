import type { ScrapingConfig } from '../../lib/types';

export const sampoernagoldConfig: ScrapingConfig<'sellPrice' | 'buybackPrice'> = {
	name: 'sampoernagold',
	displayName: 'Sampoerna Gold',
	logo: '',
	urlHomepage: 'https://sampoernagold.com',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://sampoernagold.com/',
	active: true,
	items: [
		{
			selector: {
				sellPrice: '#content > div > div.bg-gradient-grey > div > div.kurs-gold-area.row > div.col-xl-5.col-lg-6.col-md-6.col-12 > table > tbody > tr:nth-child(3) > td:nth-child(2)',
				buybackPrice: '#content > div > div.bg-gradient-grey > div > div.kurs-gold-area.row > div.col-xl-5.col-lg-6.col-md-6.col-12 > table > tbody > tr:nth-child(3) > td:nth-child(3)',
			},
		},
	],
};
