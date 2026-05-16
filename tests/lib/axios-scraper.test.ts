import { beforeEach, describe, expect, it, vi } from 'vitest';
import { JsonApiScraper } from '../../src/lib/scrapers/json-api-scraper';

global.fetch = vi.fn();

describe('JsonApiScraper', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should map json paths from selector definitions', async () => {
		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			json: async () => ({
				data: {
					buying_rate: 2500000,
					selling_rate: 2550000,
					updated_at: '2026-05-01T00:00:00.000Z',
				},
			}),
		} as Response);

		const config = {
			url: 'https://api.treasury.id/api/v1/antigrvty/gold/rate',
			engine: 'axios' as const,
			responseType: 'json' as const,
			method: 'POST' as const,
			selector: [
				{
					type: 'treasury',
					buy: 'data.buying_rate',
					sell: 'data.selling_rate',
					info: 'data.updated_at',
					weight: 1,
					unit: 'gram',
				},
			],
		};

		const scraper = new JsonApiScraper('treasury', config);
		const result = await scraper.scrape();

		expect(result.success).toBe(true);
		expect(result.count).toBe(1);
		expect(result.data).toEqual([
			{
				type: 'treasury',
				buy: '2500000',
				sell: '2550000',
				info: '2026-05-01T00:00:00.000Z',
				weight: '1',
				unit: 'gram',
			},
		]);
	});
});
