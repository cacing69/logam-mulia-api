import { parseGramWeightLabel } from '../../lib';
import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

const PRICE_ROW_REGEX =
	/<td[^>]*>\s*1 gram\s*<\/td>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>\s*<td[^>]*>\s*([\d.]+)\s*<\/td>/i;

	function postProcessRow(rawData: Record<string, string>) {
		const label = (rawData.weight ?? rawData.weightUnit ?? '').trim();
		const { weight, weightUnit } = parseGramWeightLabel(label);
		return {
			...rawData,
			weight: weight || rawData.weight,
			weightUnit: weightUnit || rawData.weightUnit,
		};
	}

export const cermatiConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'material' | 'materialType' | 'weight' | 'weightUnit'> = {
	name: 'cermati',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.cermati.com/artikel/harga-emas-hari-ini',
	active: true,
	items: [
		{
			selector: {
				sellPrice: '#parent-node > div.table-holder > table > tbody > tr:nth-child(1) > td:nth-child(2)',
				buybackPrice: raw(null),
				material: raw('gold'),
				materialType: `#parent-node > div.table-holder > table > thead > tr > th:nth-child(2)`,
				weight: `#parent-node > div.table-holder > table > tbody > tr:nth-child(1) > td:nth-child(1)`,
				weightUnit: `#parent-node > div.table-holder > table > tbody > tr:nth-child(1) > td:nth-child(1)`,
			},
			postProcess: postProcessRow,
		},
	],
};
