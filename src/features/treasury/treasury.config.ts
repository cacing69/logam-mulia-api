import type { AxiosScrapingConfig } from '../../lib';

export const treasuryConfig: AxiosScrapingConfig = {
	name: 'treasury',
	url: 'https://api.treasury.id/api/v1/antigrvty/gold/rate',
	engine: 'axios',
	responseType: 'json',
	method: 'POST',
	selector: [
		{
			sellPrice: 'data.buying_rate',
			buybackPrice: 'data.selling_rate',
			weight: 1,
			weightUnit: 'gram',
		},
	],
};
