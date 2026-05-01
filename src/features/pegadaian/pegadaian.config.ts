import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const pegadaianConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://pegadaian.co.id/produk/harga-emas-batangan-dan-tabungan-tabungan-emas',
	active: false,
	items: [
		{
			selector: {
				sell: 'body',
				buy: 'body',
				type: raw('pegadaian'),
				info: 'title',
			},
		},
	],
};
