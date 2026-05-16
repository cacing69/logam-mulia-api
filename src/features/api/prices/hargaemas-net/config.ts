import { raw, type ScrapingConfig } from '../../../../lib/types';

function postProcessRow(rawData: Record<string, string>) {
	const weightMatch = (rawData.weight ?? '').match(/[\d.,]+/);
	const weight = (weightMatch?.[0] ?? '1').replace(',', '.');
	const materialType = (rawData.materialType ?? '').replace(/Harga/g, '').trim();
	return {
		...rawData,
		weight,
		materialType,
	};
}

/** Buyback header tabel Antam — dipakai hanya untuk baris 1 gr (lihat `makeItem`). */
const buybackPriceManual1Gr =
	'main table.table.table-striped.table-sm thead tr:nth-child(2) th b font';

function makeItem(row: number) {
	// Hindari ketergantungan ke teks judul:
	// ambil tabel yang muncul tepat setelah grafik (`canvas#priceChart`) dan heading berikutnya.
	const tableRoot = 'main #priceChart + h2 + div.table-responsive > table.table.table-striped.table-sm';
	// Pada struktur situs saat ini, baris ke-2 tbody = 1 gr; hanya entri itu yang mengisi buyback dari selector manual.
	const buybackPrice = row === 2 ? buybackPriceManual1Gr : raw(null);
	return {
		selector: {
			sellPrice: `${tableRoot} > tbody > tr:nth-child(${row}) > td:nth-child(2) > font`,
			buybackPrice,
			material: raw('gold'),
			materialType: `main #priceChart + h2`,
			weight: `${tableRoot} > tbody > tr:nth-child(${row}) > td:nth-child(1)`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

export const hargaemasNetConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'weight' | 'weightUnit' | 'material' | 'materialType'> = {
	name: 'hargaemas-net',
	displayName: 'Harga Emas.net',
	logo: '',
	urlHomepage: 'https://harga-emas.net',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://harga-emas.net/',
	active: true,
	items: [
		...Array.from({ length: 12 }, (_, i) => makeItem(i + 1)),
	],
};
