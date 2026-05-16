import type { JsonApiConfig } from '../../../../lib';

export const pegadaianConfig: JsonApiConfig = {
	name: 'pegadaian',
	displayName: 'Pegadaian',
	logo: '',
	urlHomepage: 'https://sahabat.pegadaian.co.id',
	url: 'https://sahabat.pegadaian.co.id/gold/prices/chart?interval=7&isRequest=true',
	engine: 'axios',
	responseType: 'json',
	method: 'GET',
	currency: 'IDR',
	active: true,
	postProcess: (raw) => {
		const data = raw as Record<string, unknown>;
		const inner = (data?.data as Record<string, unknown>) ?? {};
		const priceList = inner.priceList;
		const lastItem = Array.isArray(priceList) && priceList.length > 0
			? priceList[priceList.length - 1] as Record<string, unknown>
			: {};
		return {
			hargaJual: String(lastItem.hargaJual ?? ''),
			hargaBeli: String(lastItem.hargaBeli ?? ''),
		};
	},
	selector: [
		{
			sellPrice: 'hargaJual',
			buybackPrice: 'hargaBeli',
			weight: 0.01,
			weightUnit: 'gram',
		},
	],
};
