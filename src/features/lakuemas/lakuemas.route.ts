import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { JinaScraper, createErrorResponse, parseCurrency } from '../../lib';
import { lakuemasConfig } from './lakuemas.config';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	if (lakuemasConfig.active === false) {
		return c.json(createErrorResponse('inactive'), 400);
	}

	try {
		const scraper = new JinaScraper(c.env.JINA_API_KEY);
		const { text } = await scraper.fetch(lakuemasConfig.url);

		const jualMatch = text.match(/##\s*HARGA JUAL EMAS HARI INI[\s\S]*?###\s*\*\*(IDR\s*[\d,.-]+)\*\*/i);
		const beliMatch = text.match(/##\s*HARGA BELI EMAS HARI INI[\s\S]*?###\s*\*\*(IDR\s*[\d,.-]+)\*\*/i);

		let sell = jualMatch?.[1]?.trim() ?? '';
		let buy = beliMatch?.[1]?.trim() ?? '';

		if (!sell || !buy) {
			const fallbackMatches = [...text.matchAll(/IDR\s*([\d,]+),-\s*\/\s*Gram/gi)];
			if (!buy) buy = fallbackMatches[0]?.[1] ? `IDR ${fallbackMatches[0][1]},-` : '';
			if (!sell) sell = fallbackMatches[1]?.[1] ? `IDR ${fallbackMatches[1][1]},-` : '';
		}

		return c.json({
			success: true,
			data: [{
				material: 'gold',
				materialType: 'lakuemas',
				buybackPrice: parseCurrency(buy),
				sellPrice: parseCurrency(sell),
				weight: 1,
				weightUnit: 'gr',
			}],
			count: 1,
			timestamp: new Date().toISOString(),
			source: 'lakuemas',
			currency: lakuemasConfig.currency,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return c.json(createErrorResponse(message), 500);
	}
});

export default app;
