import { raw, type ScrapingConfig } from '../../lib/types/scraper.types';

function parseMaterialType(text: string): string {
	return text.replace(/^Harga\s+/i, '').replace(/\s*\(.*?\)/, '').trim();
}

function postProcessRow(rawData: Record<string, string>) {
	return {
		...rawData,
		materialType: parseMaterialType(rawData.materialType ?? ''),
	};
}

function makeItem(row: number) {

	return {
		selector: {
			weight: `#main > div > div:nth-child(7) > table:nth-child(6) > tbody > tr:nth-child(2) > td.bold`,
			sellPrice: `#main > div > div:nth-child(7) > table:nth-child(6) > tbody > tr:nth-child(${row}) > td:nth-child(2)`,
			buybackPrice: `#main > div > div:nth-child(7) > table:nth-child(6) > tbody > tr:nth-child(${row}) > td:nth-child(3)`,
			material: raw('gold'),
			materialType: `#main > div > div:nth-child(7) > h2:nth-child(5)`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

const DATA_ROW_COUNT = 12;

export const kursdolarConfig: ScrapingConfig<
	'buybackPrice' | 'sellPrice' | 'weight' | 'weightUnit' | 'material' | 'materialType'
> = {
	name: 'kursdolar',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://kurs.dollar.web.id/harga-emas-hari-ini.php',
	active: true,
	items: [
		...Array.from({ length: DATA_ROW_COUNT }, (_, i) => makeItem(i + 2))
	],
};
