import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const emaskuConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://r.jina.ai/https://www.emasku.co.id/id',
	active: true,
	items: [
		{
			selector: {
				sell: 'body',
				buy: 'body',
				type: raw('emasku'),
				info: raw('Harga Emas Hari Ini - EMASKU (HRTA Gold)'),
			},
			postProcess: (rawData) => {
				const text = rawData.sell ?? '';

				// buy (harga jual) — ## Rp pattern
				const buyMatch = text.match(/##\s*Rp\s*([\d,.]+)/);
				const buy = buyMatch?.[1]?.trim() ?? '';

				// sell (buyback) — after "Harga Buyback" then "Rp"
				const sellMatch = text.match(/Harga Buyback[\s\S]*?Rp\s*([\d,.]+)/);
				const sell = sellMatch?.[1]?.trim() ?? '';

				return {
					sell,
					buy,
					type: rawData.type ?? 'emasku',
					info: rawData.info ?? '',
				};
			},
		},
	],
};
