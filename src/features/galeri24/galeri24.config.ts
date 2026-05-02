import type { ScrapingConfig } from '../../lib/types/scraper.types';

export const galeri24Config: ScrapingConfig<'sellPrice' | 'buybackPrice'> = {
	name: 'galeri24',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://galeri24.co.id/harga-emas',
	active: true,
	items: [
		{
			selector: {
				sellPrice: '#GALERI\\ 24 > div > div.overflow-x-scroll.hide-scroll.lg\\:overflow-visible.border > div > div:nth-child(3) > div:nth-child(2)',
				buybackPrice: '#GALERI\\ 24 > div > div.overflow-x-scroll.hide-scroll.lg\\:overflow-visible.border > div > div:nth-child(3) > div:nth-child(3)',
			},
		},
	],
};
