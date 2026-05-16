import { raw, type ScrapingConfig } from '../../../../lib/types';

/**
 * Tabel LM Antam/Pegadaian.
 *
 * **Robust:** jangkar ke `table[class*="HistoryAntamTable_table"]` dan `td[class*="…"]`.
 * **Hindari:** rantai dari `body` ke `.HistoryHargaPage_*__XFVpA` — sufiks `__…` adalah hash
 * CSS Modules Next.js; bisa berubah saat deploy sehingga selector berhenti cocok walau DOM sama.
 *
 * Setara aman untuk harga Antam baris 1, kolom 2:
 * `table[class*="HistoryAntamTable_table"] tbody tr:nth-child(1) td:nth-child(2) p`
 */
const antamTable = 'table[class*="HistoryAntamTable_table"]';

function postProcessRow(rawData: Record<string, string>) {
	const weightMatch = (rawData.weight ?? '').match(/[\d.,]+/);
	const weight = (weightMatch?.[0] ?? '1').replace(',', '.');
	const materialType = (rawData.materialType ?? '').replace(/Harga/g, '').trim();

	let buybackClean = (rawData.buybackPrice ?? '').trim();
	if (buybackClean) {
		const buybackMatch = buybackClean.match(/pembelian\s+kembali:\s*Rp?\s*([\d.,]+)/i);
		buybackClean = buybackMatch ? buybackMatch[1] : '';
	}

	return {
		...rawData,
		weight,
		materialType,
		buybackPrice: buybackClean,
	};
}

/**
 * Satu baris isi tabel (urutan situs: 1000 … 0,5 g). Bukan baris catatan terakhir.
 * Kolom: 1 = gram, 2 = Antam, 3 = Pegadaian — kita pakai Antam untuk sell.
 */
/** Baris tbody untuk **1 g** pada urutan tabel saat ini (1000…500…1…0,5); bukan baris catatan. */
const ONE_GRAM_TBODY_ROW = 10;

function makeItem(row: number,  col: number) {
	const buybackFromNotes = `${antamTable} tbody tr:last-child td:nth-child(2)`;
	const buybackPrice = row === ONE_GRAM_TBODY_ROW && col === 2 ? buybackFromNotes : raw(null);
	return {
		selector: {
			weight: `${antamTable} tbody tr:nth-child(${row}) td[class*="HistoryAntamTable_gram-list"] p`,
			sellPrice: `${antamTable} tbody tr:nth-child(${row}) td:nth-child(${col}) p`,
			buybackPrice,
			material: raw('gold'),
			materialType: `${antamTable} thead tr:first-child th:nth-child(${col}) span`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

/** Saat ini 11 baris berat (tbody terakhir = catatan buyback). */
const DATA_ROW_COUNT = 11;

export const hargaemasOrgConfig: ScrapingConfig<
	'buybackPrice' | 'sellPrice' | 'weight' | 'weightUnit' | 'material' | 'materialType'
> = {
	name: 'hargaemas-org',
	displayName: 'Harga Emas.org',
	logo: '',
	urlHomepage: 'https://harga-emas.org',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.org/history-harga',
	active: true,
	items: [
		...Array.from({ length: DATA_ROW_COUNT }, (_, i) => makeItem(i + 1, 2)),
		...Array.from({ length: DATA_ROW_COUNT }, (_, i) => makeItem(i + 1, 3))
	],
};
