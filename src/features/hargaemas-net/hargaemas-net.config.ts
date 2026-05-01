import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const hargaemasNetConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.net/',
	active: true,
	items: [
		{
			selector: {
				sell: 'html:body',
				buy: 'html:body',
				type: raw('antam-1gr'),
				info: 'h1',
			},
			postProcess: (rawData) => {
				const text = rawData.sell ?? '';
				const buyMatch =
					text.match(/Harga buyback:[\s\S]{0,80}?([\d]{1,3}(?:\.[\d]{3})+)/i) ??
					text.match(/buyback[\s\S]{0,120}?([\d]{1,3}(?:\.[\d]{3})+)/i);
				const sellMatch =
					text.match(/<td>\s*1 gr\s*<\/td>\s*<td>\s*([\d.]+)/i) ??
					text.match(/1\s*gr[\s\S]{0,120}?([\d]{1,3}(?:\.[\d]{3})+)/i);

				return {
					sell: sellMatch?.[1] ?? '',
					buy: buyMatch?.[1] ?? '',
					type: rawData.type ?? 'antam-1gr',
					info: rawData.info ?? 'Harga Emas Hari Ini',
				};
			},
		},
	],
};
