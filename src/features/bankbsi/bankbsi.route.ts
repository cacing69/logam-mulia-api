import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { CheerioScraper, createErrorResponse, defaultScrapingOptions, parseCurrency } from '../../lib';
import { fetchOrCache } from '../../lib/price-service';
import { bankbsiConfig } from './bankbsi.config';

const app = new Hono<{ Bindings: Bindings }>();

const scraper = new CheerioScraper('bankbsi', bankbsiConfig);

app.get('/', async (c) => {
	const refresh = c.req.query('refresh') === 'true';
	const result = await fetchOrCache(c.env, bankbsiConfig.name, { refresh }, () =>
		scraper.scrape(
			(raw) => ({
				type: raw.type || 'unknown',
				buybackPrice: parseCurrency(raw.buybackPrice),
				price: parseCurrency(raw.sellPrice),
				info: raw.info,
				weight: raw.weight ? Number(raw.weight) : 1,
				weightUnit: raw.weightUnit || 'gr',
			}),
			defaultScrapingOptions,
		),
	);

	if (!result.success) {
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), 500);
	}

	return c.json(result);
});

export default app;
