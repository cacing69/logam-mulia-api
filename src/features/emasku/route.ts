import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { createErrorResponse, defaultScrapingOptions } from '../../lib';
import { fetchOrCache } from '../../lib/services/price-service';
import { emaskuConfig } from './config';
import { scrapeEmaskuForFetchOrCache } from './scrape';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	const refresh = c.req.query('refresh') === 'true';
	const result = await fetchOrCache(c.env, emaskuConfig.name, { refresh }, () =>
		scrapeEmaskuForFetchOrCache(c.env, defaultScrapingOptions),
	);

	if (!result.success) {
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), 500);
	}

	return c.json(result);
});

export default app;
