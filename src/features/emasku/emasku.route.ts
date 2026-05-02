import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { JinaScraper, createErrorResponse, parseCurrency } from '../../lib';
import { emaskuConfig } from './emasku.config';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	if (emaskuConfig.active === false) {
		return c.json(createErrorResponse('inactive'), 400);
	}

	try {
		const scraper = new JinaScraper(c.env.JINA_API_KEY);
		const { text } = await scraper.fetch(emaskuConfig.url);

		const buyMatch = text.match(/##\s*Rp\s*([\d,.]+)/);
		const buy = buyMatch?.[1]?.trim() ?? '';

		const sellMatch = text.match(/Harga Buyback[\s\S]*?Rp\s*([\d,.]+)/);
		const sell = sellMatch?.[1]?.trim() ?? '';

		return c.json({
			success: true,
			data: [{
				material: 'gold',
				materialType: 'emasku',
				buybackPrice: parseCurrency(buy),
				sellPrice: parseCurrency(sell),
				weight: 1,
				weightUnit: 'gr',
			}],
			count: 1,
			timestamp: new Date().toISOString(),
			source: 'emasku',
			currency: emaskuConfig.currency,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return c.json(createErrorResponse(message), 500);
	}
});

export default app;
