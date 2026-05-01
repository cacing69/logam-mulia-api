import { Hono } from 'hono';
import { CheerioScraper, parseCurrency } from '../../lib';
import { anekalogamConfig } from './anekalogam.config';

const app = new Hono();

const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

app.get('/', async (c) => {
	const result = await scraper.scrape(
		(raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: parseCurrency(raw.buy),
			info: raw.info,
			sellRaw: raw.sell,
			buyRaw: raw.buy,
		}),
		{
			headers: {
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
			},
			timeout: 15000,
		}
	);

	if (!result.success) {
		const statusCode = result.inactive ? 400 : 500;
		return c.json(
			{
				success: false,
				error: result.error,
				timestamp: result.timestamp,
				source: result.source,
			},
			statusCode
		);
	}

	// Ensure data is always array
	return c.json({
		success: true,
		data: Array.isArray(result.data) ? result.data : [result.data],
		count: result.count ?? (Array.isArray(result.data) ? result.data.length : 1),
		timestamp: result.timestamp,
		source: result.source,
		currency: result.currency,
	});
});

export default app;
