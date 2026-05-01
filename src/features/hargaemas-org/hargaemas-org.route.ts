import { Hono } from 'hono';
import { CheerioScraper, defaultScrapingOptions, parseCurrency } from '../../lib';
import { hargaemasOrgConfig } from './hargaemas-org.config';

const app = new Hono();

const scraper = new CheerioScraper('hargaemas-org', hargaemasOrgConfig);

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
		defaultScrapingOptions
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
