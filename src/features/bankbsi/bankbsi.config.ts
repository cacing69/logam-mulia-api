import { parseGramWeightLabel } from '../../lib/utils/parse-gram-weight-label';
import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

/** Regex label berat di UI BSI (termasuk lewat Google Translate): `1 gram`, `1gram`, dll. */
export const bankbsiGramWeightLabelRe = /^([\d.,]+)\s*gram$/i;

export const bankbsiConfig: ScrapingConfig<
	'buybackPrice' | 'sellPrice' | 'type' | 'info' | 'weight' | 'weightUnit'
> = {
	name: 'bankbsi',
	engine: 'cheerio',
	currency: 'IDR',
	url: 'https://translate.google.com/translate?sl=id&tl=en&u=https://www.bankbsi.co.id/',
	active: true,
	items: [
		{
			selector: {
				sellPrice: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(2) p',
				buybackPrice: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(3) p',
				weight: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(1)',
				weightUnit: '#wrapper-data-gold-1 .gold-list-row:nth-child(1) > div:nth-child(1)',
				type: raw('bankbsi'),
				info: 'title',
			},
			postProcess: (rawData) => {
				const label = (rawData.weight ?? rawData.weightUnit ?? '').trim();
				const { weight, weightUnit } = parseGramWeightLabel(label, {
					pattern: bankbsiGramWeightLabelRe,
				});
				return {
					...rawData,
					weight,
					weightUnit,
				};
			},
		},
	],
};
