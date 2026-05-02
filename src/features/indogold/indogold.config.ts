import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const indogoldConfig: ScrapingConfig<'buybackPrice' | 'sellPrice'> = {
	name: 'indogold',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.indogold.id/',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#basic-price',
				sellPrice: raw(''),
			},
			postProcess: (rawData) => {
				const text = rawData.buybackPrice ?? '';
				const priceMatch = text.match(/Harga Beli[\s\S]*?Rp\s*([\d,\.]+)/i);
				const buybackPriceMatch = text.match(/Harga Jual[\s\S]*?Rp\s*([\d,\.]+)/i);

				return {
					buybackPrice: buybackPriceMatch?.[1] ?? '',
					sellPrice: priceMatch?.[1] ?? '',
				};
			},
		},
	],
};
