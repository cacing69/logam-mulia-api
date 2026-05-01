import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const logammuliaConfig: ScrapingConfig<'sellPrice' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.logammulia.com/harga-emas-hari-ini',
	active: true,
	items: [
		{
			selector: {
				sellPrice: 'html:.table-bordered',
				type: raw('antam'),
				info: 'h2.ngc-title',
			},
			postProcess: (rawData) => {
				const html = rawData.sellPrice ?? '';
				const rows = html.split('</tr>');

				let buybackPrice = '';
				for (const row of rows) {
					const cells = row.split('</td>');
					if (cells.length < 3) continue;

					const weight = cells[0]?.replace(/<[^>]+>/g, '').trim() ?? '';
					if (weight === '1 gr') {
						buybackPrice = cells[1]?.replace(/<[^>]+>/g, '').trim() ?? '';
						break;
					}
				}

				return {
					type: rawData.type ?? 'emas batangan antam',
					buybackPrice,
					sellPrice: '',
					info: rawData.info ?? '',
				};
			},
		},
	],
};
