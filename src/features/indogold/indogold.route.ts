import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { createErrorResponse, parseCurrency } from '../../lib';
import { fetchOrCache } from '../../lib/price-service';
import { INDOGOLD_API_URL, INDOGOLD_PAGE_URL, indogoldConfig } from './indogold.config';

const RP_PREFIX = /^Rp\.?\s*/i;

interface PriceEntry {
	harga: string;
	harga_buyback?: string;
}

interface DenomData {
	[denom: string]: {
		[brand: string]: PriceEntry;
	};
}

interface PricelistResponse {
	status: number;
	data?: {
		list_variant: string[];
		data_denom: DenomData;
		type: string;
	};
	error?: string;
}

async function fetchToken(): Promise<{ token: string; cookie: string }> {
	const res = await fetch(INDOGOLD_PAGE_URL);
	const html = await res.text();

	const tokenMatch = html.match(/simulasi-token","([a-f0-9]+)/);
	if (!tokenMatch) throw new Error('Failed to extract simulasi-token from page');

	const setCookie = res.headers.get('set-cookie') ?? '';
	const sessionMatch = setCookie.match(/ci_session=([^;]+)/);
	if (!sessionMatch) throw new Error('Failed to extract session cookie');

	return { token: tokenMatch[1], cookie: `ci_session=${sessionMatch[1]}` };
}

async function fetchPricelist(): Promise<PricelistResponse> {
	const { token, cookie } = await fetchToken();

	const res = await fetch(INDOGOLD_API_URL, {
		method: 'POST',
		headers: {
			'Cookie': cookie,
			'X-Requested-With': 'XMLHttpRequest',
		},
		body: new URLSearchParams({
			form: JSON.stringify({ product: 'comparison_antamxubs' }),
			'simulasi-token': token,
		}),
	});

	return res.json() as Promise<PricelistResponse>;
}

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	const refresh = c.req.query('refresh') === 'true';

	const result = await fetchOrCache(c.env, 'indogold', { refresh }, async () => {
		try {
			const response = await fetchPricelist();
			const items: unknown[] = [];

			if (response.data?.data_denom) {
				for (const [denom, brands] of Object.entries(response.data.data_denom)) {
					const weight = parseFloat(denom.replace(',', '.'));
					for (const [brand, entry] of Object.entries(brands)) {
						items.push({
							material: 'gold',
							materialType: brand,
							buybackPrice: parseCurrency((entry.harga_buyback ?? '').replace(RP_PREFIX, '')),
							sellPrice: parseCurrency(entry.harga.replace(RP_PREFIX, '')),
							weight,
							weightUnit: 'gr',
						});
					}
				}
			}

			if (items.length === 0) {
				return {
					success: false,
					data: [],
					count: 0,
					timestamp: new Date().toISOString(),
					source: indogoldConfig.name,
					currency: indogoldConfig.currency,
					error: response.error ?? 'No price data available',
				};
			}

			return {
				success: true,
				data: items,
				count: items.length,
				timestamp: new Date().toISOString(),
				source: indogoldConfig.name,
				currency: indogoldConfig.currency,
			};
		} catch (error) {
			const message = error instanceof Error ? error.message : 'Unknown error';
			return {
				success: false,
				data: [],
				count: 0,
				timestamp: new Date().toISOString(),
				source: indogoldConfig.name,
				currency: indogoldConfig.currency,
				error: message,
			};
		}
	});

	if (!result.success) {
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), 500);
	}

	return c.json(result);
});

export default app;
