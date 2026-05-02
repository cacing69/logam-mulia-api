import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hargaemasNetConfig: ScrapingConfig<'buybackPrice' | 'sellPrice'> = {
	name: 'hargaemas-net',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.net/',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: 'html:body',
				sellPrice: 'html:body',
			},
			postProcess: (rawData) => {
				const text = rawData.buybackPrice ?? '';
				const priceMatch =
					text.match(/Harga buyback:[\s\S]{0,80}?([\d]{1,3}(?:\.[\d]{3})+)/i) ??
					text.match(/buyback[\s\S]{0,120}?([\d]{1,3}(?:\.[\d]{3})+)/i);
				const buybackPriceMatch =
					text.match(/<td>\s*1 gr\s*<\/td>\s*<td>\s*([\d.]+)/i) ??
					text.match(/1\s*gr[\s\S]{0,120}?([\d]{1,3}(?:\.[\d]{3})+)/i);

				return {
					buybackPrice: buybackPriceMatch?.[1] ?? '',
					sellPrice: priceMatch?.[1] ?? '',
				};
			},
		},
	],
};
