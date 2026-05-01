import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const indogoldConfig: ScrapingConfig<'buybackPrice' | 'price' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.indogold.id/',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#basic-price',
				price: raw(''),
				type: raw('indogold'),
				info: '#basic-price',
			},
			postProcess: (rawData) => {
				const text = rawData.buybackPrice ?? '';
				const priceMatch = text.match(/Harga Beli[\s\S]*?Rp\s*([\d,\.]+)/i);
				const buybackPriceMatch = text.match(/Harga Jual[\s\S]*?Rp\s*([\d,\.]+)/i);
				const timeMatch = text.match(/(\d{2}\s+[A-Za-z]{3}\s+\d{4}\s+\d{2}:\d{2})/i);

				return {
					buybackPrice: buybackPriceMatch?.[1] ?? '',
					price: priceMatch?.[1] ?? '',
					type: rawData.type ?? 'indogold',
					info: timeMatch?.[1] ?? 'Harga emas IndoGold',
				};
			},
		},
	],
};
