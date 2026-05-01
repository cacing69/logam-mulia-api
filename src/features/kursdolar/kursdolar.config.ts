import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const kursdolarConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://kurs.dollar.web.id/harga-emas-hari-ini.php',
	active: true,
	items: [
		{
			selector: {
				// Emas row: col-2 Buyback, col-3 Lantakan
				sellPrice: "table tr:has(td.bold:contains('Emas')) td:nth-child(2)",
				buybackPrice: "table tr:has(td.bold:contains('Emas')) td:nth-child(3)",
				type: raw('emas'),
				info: "h1:contains('Harga Emas Hari Ini')",
			},
		},
	],
};
