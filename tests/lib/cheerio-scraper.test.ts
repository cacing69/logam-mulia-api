import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheerioScraper } from '../../src/lib/scrapers/cheerio-scraper';
import { raw } from '../../src/lib/types/scraper.types';

// Mock fetch globally
global.fetch = vi.fn();

describe('CheerioScraper', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('single item scraping', () => {
		it('should scrape single item with selector', async () => {
			const mockHtml = `
				<html>
					<body>
						<div id="price">
							<span class="sell">1000000</span>
							<span class="buy">950000</span>
						</div>
					</body>
				</html>
			`;

			vi.mocked(global.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => mockHtml,
			} as Response);

			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				selector: {
					sell: '#price .sell',
					buy: '#price .buy',
				},
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				sell: '1000000',
				buy: '950000',
			});
			expect(result.count).toBeUndefined();
		});

		it('should handle raw values', async () => {
			const mockHtml = '<html><body><span class="price">1000000</span></body></html>';

			vi.mocked(global.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => mockHtml,
			} as Response);

			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				selector: {
					price: '.price',
					type: raw('antam'),
					currency: raw('IDR'),
				},
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				price: '1000000',
				type: 'antam',
				currency: 'IDR',
			});
		});
	});

	describe('multiple items scraping', () => {
		it('should scrape multiple items from different URLs', async () => {
			const mockHtml1 = '<html><body><span class="sell">1000000</span><span class="buy">950000</span></body></html>';
			const mockHtml2 = '<html><body><span class="sell">2000000</span><span class="buy">1950000</span></body></html>';

			vi.mocked(global.fetch)
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					text: async () => mockHtml1,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					text: async () => mockHtml2,
				} as Response);

			const config = {
				engine: 'cheerio' as const,
				currency: 'IDR',
				items: [
					{
						url: 'https://example.com/page1',
						selector: {
							sell: '.sell',
							buy: '.buy',
							type: raw('antam'),
						},
					},
					{
						url: 'https://example.com/page2',
						selector: {
							sell: '.sell',
							buy: '.buy',
							type: raw('ubs'),
						},
					},
				],
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(true);
			expect(Array.isArray(result.data)).toBe(true);
			expect(result.count).toBe(2);
			expect(result.data).toEqual([
				{ sell: '1000000', buy: '950000', type: 'antam' },
				{ sell: '2000000', buy: '1950000', type: 'ubs' },
			]);
		});

		it('should skip failed items and continue', async () => {
			const mockHtml = '<html><body><span class="sell">1000000</span></body></html>';

			vi.mocked(global.fetch)
				.mockRejectedValueOnce(new Error('Network error'))
				.mockResolvedValueOnce({
					ok: true,
					status: 200,
					text: async () => mockHtml,
				} as Response);

			const config = {
				engine: 'cheerio' as const,
				items: [
					{
						url: 'https://example.com/page1',
						selector: { sell: '.sell' },
					},
					{
						url: 'https://example.com/page2',
						selector: { sell: '.sell' },
					},
				],
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(true);
			expect(result.count).toBe(1);
			expect(result.data).toEqual([{ sell: '1000000' }]);
		});
	});

	describe('error handling', () => {
		it('should return inactive error when scraper is disabled', async () => {
			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				active: false,
				selector: { sell: '.sell' },
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(false);
			expect(result.error).toBe('inactive');
			expect(result.inactive).toBe(true);
		});

		it('should handle HTTP errors', async () => {
			vi.mocked(global.fetch).mockResolvedValueOnce({
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
			} as Response);

			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				selector: { sell: '.sell' },
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(false);
			expect(result.error).toContain('HTTP 500');
		});

		it('should handle timeout', async () => {
			vi.mocked(global.fetch).mockImplementationOnce(
				() =>
					new Promise((_, reject) =>
						setTimeout(() => reject(new Error('AbortError')), 100)
					)
			);

			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				selector: { sell: '.sell' },
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape(undefined, { timeout: 50 });

			expect(result.success).toBe(false);
		});

		it('should handle missing config', async () => {
			const config = {
				engine: 'cheerio' as const,
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape();

			expect(result.success).toBe(false);
			expect(result.error).toContain('No selector or items defined');
		});
	});

	describe('transformer function', () => {
		it('should apply transformer to scraped data', async () => {
			const mockHtml = '<html><body><span class="price">Rp1.500.000</span></body></html>';

			vi.mocked(global.fetch).mockResolvedValueOnce({
				ok: true,
				status: 200,
				text: async () => mockHtml,
			} as Response);

			const config = {
				url: 'https://example.com',
				engine: 'cheerio' as const,
				selector: { price: '.price' },
			};

			const scraper = new CheerioScraper('test', config);
			const result = await scraper.scrape((data) => ({
				raw: data.price,
				parsed: parseInt(data.price.replace(/\D/g, '')),
			}));

			expect(result.success).toBe(true);
			expect(result.data).toEqual({
				raw: 'Rp1.500.000',
				parsed: 1500000,
			});
		});
	});
});
