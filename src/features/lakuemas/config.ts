import type { JinaMarkdownLabelPriceConfig } from '../../lib/scrapers/jina-markdown-label-scrape';

const lakuemasSellPriceRe =
	/HARGA JUAL EMAS HARI INI\s*(?:\n\s*)?###\s*\*\*IDR\s*([\d,.-]+)/i;

const lakuemasBuybackPriceRe =
	/HARGA BELI EMAS HARI INI\s*(?:\n\s*)?###\s*\*\*IDR\s*([\d,.-]+)/i;

export const lakuemasConfig: JinaMarkdownLabelPriceConfig = {
	name: 'lakuemas',
	displayName: 'Laku Emas',
	logo: '',
	url: 'http://lakuemas.com/harga',
	currency: 'IDR',
	active: true,
	items: [
		{
			weight: 1,
			weightUnit: 'gr',
			materialType: 'Laku Emas',
			material: 'gold',
			sellPriceRegex: lakuemasSellPriceRe,
			buybackPriceRegex: lakuemasBuybackPriceRe,
		},
	],
};
