import { raw, type ScrapingConfig } from '../../lib/types/scraper.types';

function postProcessRow(rawData: Record<string, string>) {
	return {
		...rawData,
	};
}

function makeItemAntam(row: number) {
	const base = '#parent-node > div.table-holder > table';
	return {
		selector: {
			sellPrice: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > tbody > tr:nth-child(${row}) > td:nth-child(2)`,
			buybackPrice: raw(null),
			material: raw('gold'),
			materialType: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > thead > tr > td:nth-child(2) > strong`,
			weight: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > tbody > tr:nth-child(${row}) > td:nth-child(1)`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

function makeItemPegadaian(row: number) {
	const base = '#parent-node > div.table-holder > table';
	return {
		selector: {
			sellPrice: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > tbody > tr:nth-child(${row}) > td:nth-child(3)`,
			buybackPrice: raw(null),
			material: raw('gold'),
			materialType: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > thead > tr > td:nth-child(3) > strong`,
			weight: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-sm > tbody > tr:nth-child(${row}) > td:nth-child(1)`,
			weightUnit: raw('gr'),
		},
		postProcess: postProcessRow,
	};
}

export const hargaemasComConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'material' | 'materialType' | 'weight' | 'weightUnit'> = {
	name: 'hargaemas-com',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.hargaemas.com/',
	active: true,
	items: [
		{
			selector: {
				sellPrice: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(1) > div.price-current`,
				buybackPrice: `body > div.container > section.featured-posts > div.row > div:nth-child(1) > table.table.table-bordered.table-dark > tbody > tr:nth-child(2) > td:nth-child(2) > div.price-current`,
				material: raw('gold'),
				materialType: `body > div.container > section.featured-posts > div.section-title > h2 > span:nth-child(1)`,
				weight: raw(1),
				weightUnit: raw('gr'),
			},
		},
		{
			selector: {
				sellPrice: `body > div.container > div.mainheading > table > tbody > tr:nth-child(2) > td:nth-child(3) > div.price-current`,
				buybackPrice: raw(null),
				material: raw('gold'),
				materialType: `body > div.container > div.mainheading > table > thead > tr > td > span.main-header`,
				weight: raw(1),
				weightUnit: raw('gr'),
			},
		},
		...Array.from({ length: 12 }, (_, i) => makeItemAntam(i + 1)),
		...Array.from({ length: 12 }, (_, i) => makeItemPegadaian(i + 1)),
	],
};
