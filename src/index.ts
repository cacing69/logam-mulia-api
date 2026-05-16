import { Hono } from 'hono';
import { createErrorResponse, getHistoryBySource } from './lib';
import { registerPriceFeatures } from './lib/feature-registry';
import type { Bindings } from './types';
import rootRoute from './features/root';
import healthRoute from './features/health';

const app = new Hono<{ Bindings: Bindings }>();

app.route('/', rootRoute);
app.route('/health', healthRoute);

const SOURCES = registerPriceFeatures(app);

app.get('/api/prices', (c) => {
	return c.json(SOURCES);
});

const SUPPORTED_SOURCES = new Set(SOURCES.map((s) => s.name));

app.get('/api/prices/:source/history', async (c) => {
	const source = c.req.param('source');
	if (!SUPPORTED_SOURCES.has(source)) {
		return c.json(createErrorResponse('Unknown source'), 404);
	}

	const result = await getHistoryBySource(c.env, source, {
		page: c.req.query('page'),
		length: c.req.query('length'),
		weight: c.req.query('weight'),
		materialType: c.req.query('materialType'),
	});

	if (!result.success) {
		const statusCode = result.statusCode === 400 ? 400 : 500;
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), statusCode);
	}

	return c.json(result);
});

export default app;
