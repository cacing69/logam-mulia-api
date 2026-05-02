import { Hono } from 'hono';
import { AxiosScraper, createErrorResponse, defaultScrapingOptions, parseCurrency } from '../../lib';
import { pegadaianConfig } from './pegadaian.config';

const app = new Hono();

const scraper = new AxiosScraper('pegadaian', pegadaianConfig);

app.get('/', async (c) => {
	const result = await scraper.scrape(
		(raw) => ({
			material: raw.material || 'gold',
			materialType: raw.materialType || 'unknown',
			buybackPrice: parseCurrency(raw.buybackPrice),
			sellPrice: parseCurrency(raw.sellPrice),
			weight: raw.weight ? Number(raw.weight) : 1,
			weightUnit: raw.weightUnit || 'gr',
		}),
		defaultScrapingOptions,
	);

	if (!result.success) {
		return c.json(createErrorResponse(result.error ?? 'Unknown error'), 500);
	}

	return c.json(result);
});

export default app;
