import { parseGramWeightLabel } from '../../lib';
import type { ScrapingConfig } from '../../lib/types';
import { raw } from '../../lib/types';

function postProcessRow(rawData: Record<string, string>) {
	const label = (rawData.weight ?? rawData.weightUnit ?? '').trim();
	const { weight, weightUnit } = parseGramWeightLabel(label);

	const raw = rawData.materialType ?? '';
	const match = raw.match(/Harga\s+(.+?)\s*\(dalam Rupiah\)/);
	const materialType = (match?.[1] ?? raw).replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

	return {
		...rawData,
		materialType,
		weight: weight || rawData.weight,
		weightUnit: weightUnit || rawData.weightUnit,
	};
}

function makeItem(row: number, col: number) {
	const base = '#parent-node > div.table-holder > table';
	return {
		selector: {
			sellPrice: `${base} > tbody > tr:nth-child(${row}) > td:nth-child(${col})`,
			buybackPrice: raw(null),
			material: raw('gold'),
			materialType: `${base} > thead > tr > th:nth-child(${col})`,
			weight: `${base} > tbody > tr:nth-child(${row}) > td:nth-child(1)`,
			weightUnit: `${base} > tbody > tr:nth-child(${row}) > td:nth-child(1)`,
		},
		postProcess: postProcessRow,
	};
}

export const cermatiConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'material' | 'materialType' | 'weight' | 'weightUnit'> = {
	name: 'cermati',
	displayName: 'Cermati',
	logo: '',
	urlHomepage: 'https://www.cermati.com',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.cermati.com/artikel/harga-emas-hari-ini',
	active: true,
	items: [
		...Array.from({ length: 12 }, (_, i) => makeItem(i + 1, 2)),
		...Array.from({ length: 12 }, (_, i) => makeItem(i + 1, 3)),
	],
};
