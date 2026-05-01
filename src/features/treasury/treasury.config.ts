import type { AxiosScrapingConfig } from '../../lib';

export const treasuryConfig: AxiosScrapingConfig = {
	url: 'https://api.treasury.id/api/v1/antigrvty/gold/rate',
	engine: 'axios',
	responseType: 'json',
	method: 'POST',
	selector: [
		{
			type: 'treasury',
			price: 'data.buying_rate',
			buybackPrice: 'data.selling_rate',
			info: 'data.updated_at',
			weight: 1,
			unit: 'gram',
		},
	],
};
