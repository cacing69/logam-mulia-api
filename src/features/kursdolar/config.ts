import { raw, type ScrapingConfig } from '../../lib/types';

/**
 * Blok `schema.org/Table` berisi: tabel spot internasional, small, iklan, hr, h2 BSI, lalu **tabel BSI** (`nth-child(6)`).
 * Jangkar lewat `itemscope` + `#main` agar tetap cocok pada varian AMP / non-AMP.
 */
const schemaTableBlock = '#main div[itemscope][itemtype*="schema.org/Table"]';
const bsiPriceTable = `${schemaTableBlock} > table:nth-child(6)`;

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
			weight: `${bsiPriceTable} tbody tr:nth-child(${row}) > td.bold`,
			sellPrice: `${bsiPriceTable} tbody tr:nth-child(${row}) > td:nth-child(3)`,
			buybackPrice: `${bsiPriceTable} tbody tr:nth-child(${row}) > td:nth-child(2)`,
			material: raw('gold'),
			materialType: `${schemaTableBlock} > h2:nth-child(5)`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

/** Tabel BSI: header `tr` ke-1, lalu baris 1 g … 500 g (12 baris). */
const DATA_ROW_COUNT = 12;

export const kursdolarConfig: ScrapingConfig<
	'buybackPrice' | 'sellPrice' | 'weight' | 'weightUnit' | 'material' | 'materialType'
> = {
	name: 'kursdolar',
	displayName: 'Kurs Dolar',
	logo: '',
	urlHomepage: 'https://kurs.dollar.web.id',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://kurs.dollar.web.id/harga-emas-hari-ini.php',
	active: true,
	items: [...Array.from({ length: DATA_ROW_COUNT }, (_, i) => makeItem(i + 2))],
};
