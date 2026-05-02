import { parseGramWeightLabel } from '../../lib/utils/parse-gram-weight-label';
import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

const certicardMaterialTypeSelector =
	'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > p';

function parseCerticardMaterialType(text: string): string {
	const match = text.match(/Harga berlaku untuk\s+(.+)/);
	return match?.[1]?.trim() ?? 'Antam';
}

function postProcessCerticardRow(rawData: Record<string, string>) {
	const label = (rawData.weight ?? rawData.weightUnit ?? '').trim();
	const { weight, weightUnit } = parseGramWeightLabel(label);
	return {
		...rawData,
		materialType: parseCerticardMaterialType(rawData.materialType ?? ''),
		weight: weight || rawData.weight,
		weightUnit: weightUnit || rawData.weightUnit,
	};
}

export const anekalogamConfig: ScrapingConfig<'buybackPrice' | 'sellPrice' | 'material' | 'materialType' | 'weight' | 'weightUnit' | 'info'> = {
	name: 'anekalogam',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://www.anekalogam.co.id/id',
	active: true,
	items: [
		{
			selector: {
				buybackPrice: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(1) .tprice',
				sellPrice: '#today-price > div.section-intro > div.buy-sell-rate > div:nth-child(2) .tprice',
				material: raw('gold'),
				materialType: "#today-price > div.section-intro > p:nth-child(3)",
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: raw(1),
				weightUnit: raw('gr'),
			},
			postProcess: (rawData) => {
				const text = rawData.materialType ?? '';
				const match = text.match(/^Harga\s+(.+?)\s+dari Aneka Logam\.$/);

				return {
					...rawData,
					materialType: match?.[1]?.trim() ?? rawData.materialType ?? 'Antam',
				};
			},
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(1) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(2) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(3) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(4) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(5) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(6) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(7) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
		{
			selector: {
				buybackPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(3) > span > span:nth-child(2)',
				sellPrice: 'body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(2) > span > span:nth-child(2)',
				material: raw('gold'),
				materialType: certicardMaterialTypeSelector,
				info: '#today-price > div.section-intro > p:nth-child(3)',
				weight: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(1) > a`,
				weightUnit: `body > section.section.home-certicard > div > div.certicard-row.row-2 > div.certicard-left > table > tbody > tr:nth-child(8) > td:nth-child(1) > a`,
			},
			postProcess: postProcessCerticardRow,
		},
	],
};
