import { describe, it, expect } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { anekalogamConfig } from '../../../src/features/anekalogam/anekalogam.config';

// Type guard for array data
function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

describe('AnekaLogam Integration Tests (Real HTTP)', () => {
	describe('real scraping', () => {
		it('should successfully scrape anekalogam website and return valid data structure', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				type: raw.type || 'unknown',
				sell: parseCurrency(raw.sell),
				buy: parseCurrency(raw.buy),
				info: raw.info,
				sellRaw: raw.sell,
				buyRaw: raw.buy,
			}));

			// Test structure
			expect(result.success).toBe(true);
			expect(result.timestamp).toBeTruthy();
			expect(result.source).toBe('anekalogam');
			expect(result.currency).toBe('IDR');

			// Test data is array
			expect(isArrayData(result.data)).toBe(true);
			expect(result.count).toBeGreaterThan(0);

			// Test first item structure
			if (isArrayData(result.data) && result.data.length > 0) {
				const firstItem = result.data[0];
				expect(firstItem).toHaveProperty('type');
				expect(firstItem).toHaveProperty('sell');
				expect(firstItem).toHaveProperty('buy');
				expect(firstItem).toHaveProperty('info');
				expect(firstItem).toHaveProperty('sellRaw');
				expect(firstItem).toHaveProperty('buyRaw');
			}
		});

		it('should return valid number types for sell and buy prices', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				type: raw.type,
				sell: parseCurrency(raw.sell),
				buy: parseCurrency(raw.buy),
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (!isArrayData(result.data)) {
				throw new Error('Expected array data');
			}

			expect(result.data.length).toBeGreaterThan(0);

			const firstItem = result.data[0];
			expect(typeof firstItem.sell).toBe('number');
			expect(typeof firstItem.buy).toBe('number');

			// Price should be reasonable (> 0)
			expect(firstItem.sell).toBeGreaterThan(0);
			expect(firstItem.buy).toBeGreaterThan(0);

			// Sell price should be higher than buy price
			expect(firstItem.sell).toBeGreaterThan(firstItem.buy);
		});

		it('should return string type for type and info fields', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				type: raw.type,
				info: raw.info,
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (!isArrayData(result.data)) {
				throw new Error('Expected array data');
			}

			expect(result.data.length).toBeGreaterThan(0);

			const firstItem = result.data[0];
			expect(typeof firstItem.type).toBe('string');
			expect(typeof firstItem.info).toBe('string');

			// Should not be empty
			expect(firstItem.type.length).toBeGreaterThan(0);
			expect(firstItem.info.length).toBeGreaterThan(0);
		});

		it('should have consistent data types across all fields', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				type: raw.type || 'unknown',
				sell: parseCurrency(raw.sell),
				buy: parseCurrency(raw.buy),
				info: raw.info,
				sellRaw: raw.sell,
				buyRaw: raw.buy,
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (isArrayData(result.data)) {
				for (const item of result.data) {
					// Type checking
					expect(item).toMatchObject({
						type: expect.any(String),
						sell: expect.any(Number),
						buy: expect.any(Number),
						info: expect.any(String),
						sellRaw: expect.any(String),
						buyRaw: expect.any(String),
					});

					// Value validation
					expect(item.type).not.toBe('');
					expect(item.sell).toBeGreaterThan(0);
					expect(item.buy).toBeGreaterThan(0);
					expect(item.sell).toBeGreaterThan(item.buy);
				}
			}
		});
	});

	describe('error cases', () => {
		it('should handle invalid URL gracefully', async () => {
			const invalidConfig = {
				engine: 'cheerio' as const,
				currency: 'IDR',
				items: [
					{
						url: 'https://this-url-does-not-exist-12345.com',
						selector: {
							sell: '.sell',
							buy: '.buy',
							type: 'test' as const,
						},
					},
				],
			};

			const scraper = new CheerioScraper('invalid-test', invalidConfig);
			const result = await scraper.scrape();

			// Should fail
			expect(result.success).toBe(false);
			expect(result.error).toBeTruthy();
		});

		it('should handle 404 response', async () => {
			const notFoundConfig = {
				engine: 'cheerio' as const,
				currency: 'IDR',
				items: [
					{
						url: 'https://www.anekalogam.co.id/page-does-not-exist',
						selector: {
							sell: '.sell',
							buy: '.buy',
							type: 'test' as const,
						},
					},
				],
			};

			const scraper = new CheerioScraper('not-found-test', notFoundConfig);
			const result = await scraper.scrape();

			// Should fail
			expect(result.success).toBe(false);
		});
	});
});
