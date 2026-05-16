import type { JsonApiConfig } from '../../lib/types';

export const INDOGOLD_API_URL = 'https://www.indogold.id/home/get_data_pricelist';
export const INDOGOLD_PAGE_URL = 'https://www.indogold.id/harga-emas-hari-ini';

export const indogoldConfig: JsonApiConfig = {
	name: 'indogold',
	displayName: 'Indogold',
	logo: '',
	urlHomepage: 'https://www.indogold.id',
	engine: 'axios',
	responseType: 'json',
	method: 'GET',
	currency: 'IDR',
	url: INDOGOLD_PAGE_URL,
	active: true,
	postProcess: () => {
		// Handled in route — postProcess runs before selector mapping,
		// but we need the full API response to build items dynamically.
		return {} as Record<string, string>;
	},
	selector: [],
};
