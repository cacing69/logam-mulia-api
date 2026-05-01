import { Hono } from 'hono';
import type { Bindings } from '../../types';
import { JinaScraper, parseCurrency } from '../../lib';
import { emaskuConfig } from './emasku.config';

const app = new Hono<{ Bindings: Bindings }>();

app.get('/', async (c) => {
	const timestamp = new Date().toISOString();

	if (emaskuConfig.active === false) {
		return c.json(
			{
				success: false,
				error: 'inactive',
				timestamp,
				source: 'emasku',
				currency: emaskuConfig.currency,
			},
			400
		);
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
				type: 'emasku',
				sell: parseCurrency(sell),
				buy: parseCurrency(buy),
				info: 'Harga Emas Hari Ini - EMASKU (HRTA Gold)',
			}],
			count: 1,
			timestamp,
			source: 'emasku',
			currency: emaskuConfig.currency,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return c.json(
			{
				success: false,
				error: message,
				timestamp,
				source: 'emasku',
				currency: emaskuConfig.currency,
			},
			500
		);
	}
});

export default app;
