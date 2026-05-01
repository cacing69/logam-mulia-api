import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const cermatiConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.cermati.com/artikel/harga-emas-hari-ini',
	active: true,
	items: [
		{
			selector: {
				sell: 'html:article[itemprop="articleBody"]',
				buy: raw(''),
				type: raw('cermati-antam-1g'),
				info: 'article[itemprop="articleBody"] h1',
			},
			postProcess: (rawData) => {
				const blob = rawData.sell ?? '';
				const rowMatch = blob.match(
					/<td[^>]*>\s*1 gram\s*<\/td>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>/i
				);
				const antam = rowMatch?.[1]?.trim() ?? '';
				const digital = rowMatch?.[2]?.trim() ?? '';
				const title = rawData.info?.trim() ?? '';

				return {
					sell: antam,
					buy: '',
					type: rawData.type ?? 'cermati',
					info: [title, digital ? `digital_mid: ${digital}` : ''].filter(Boolean).join(' | '),
				};
			},
		},
	],
};
