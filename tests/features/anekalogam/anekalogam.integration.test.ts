import { describe, it, expect } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { anekalogamConfig } from '../../../src/features/anekalogam/config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

describe('AnekaLogam Integration Tests (Real HTTP)', () => {
	describe('real scraping', () => {
		it('should successfully scrape anekalogam website and return valid data structure', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				material: raw.material || 'gold',
				materialType: raw.materialType || 'unknown',
				buybackPrice: parseCurrency(raw.buybackPrice),
				sellPrice: parseCurrency(raw.sellPrice),
				weight: raw.weight ? Number(raw.weight) : 1,
				weightUnit: raw.weightUnit || 'gr',
			}));

			expect(result.success).toBe(true);
			expect(result.timestamp).toBeTruthy();
			expect(result.source).toBe('anekalogam');
			expect(result.currency).toBe('IDR');
			expect(isArrayData(result.data)).toBe(true);
			expect(result.count).toBeGreaterThan(0);

			if (isArrayData(result.data) && result.data.length > 0) {
				const firstItem = result.data[0];
				expect(firstItem).toHaveProperty('material');
				expect(firstItem).toHaveProperty('materialType');
				expect(firstItem).toHaveProperty('buybackPrice');
				expect(firstItem).toHaveProperty('sellPrice');
				expect(firstItem).toHaveProperty('weight');
				expect(firstItem).toHaveProperty('weightUnit');
			}
		});

		it('should return valid number types for sellPrice and buybackPrice', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				material: raw.material || 'gold',
				materialType: raw.materialType || 'unknown',
				buybackPrice: parseCurrency(raw.buybackPrice),
				sellPrice: parseCurrency(raw.sellPrice),
				weight: raw.weight ? Number(raw.weight) : 1,
				weightUnit: raw.weightUnit || 'gr',
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (!isArrayData(result.data)) {
				throw new Error('Expected array data');
			}

			expect(result.data.length).toBeGreaterThan(0);

			const firstItem = result.data[0];
			expect(typeof firstItem.sellPrice).toBe('number');
			expect(typeof firstItem.buybackPrice).toBe('number');
			expect(firstItem.sellPrice).toBeGreaterThan(0);
			expect(firstItem.buybackPrice).toBeGreaterThan(0);
		});

		it('should return string material and materialType fields', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				material: raw.material || 'gold',
				materialType: raw.materialType || 'unknown',
				buybackPrice: parseCurrency(raw.buybackPrice),
				sellPrice: parseCurrency(raw.sellPrice),
				weight: raw.weight ? Number(raw.weight) : 1,
				weightUnit: raw.weightUnit || 'gr',
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (!isArrayData(result.data)) {
				throw new Error('Expected array data');
			}

			expect(result.data.length).toBeGreaterThan(0);

			const firstItem = result.data[0];
			expect(typeof firstItem.material).toBe('string');
			expect(typeof firstItem.materialType).toBe('string');
			expect(firstItem.material.length).toBeGreaterThan(0);
			expect(firstItem.materialType.length).toBeGreaterThan(0);
		});

		it('should have consistent data types across all fields', async () => {
			const scraper = new CheerioScraper('anekalogam', anekalogamConfig);

			const result = await scraper.scrape((raw) => ({
				material: raw.material || 'gold',
				materialType: raw.materialType || 'unknown',
				buybackPrice: parseCurrency(raw.buybackPrice),
				sellPrice: parseCurrency(raw.sellPrice),
				weight: raw.weight ? Number(raw.weight) : 1,
				weightUnit: raw.weightUnit || 'gr',
			}));

			expect(result.success).toBe(true);
			expect(result.data).toBeTruthy();

			if (isArrayData(result.data)) {
				for (const item of result.data) {
					expect(item).toMatchObject({
						material: expect.any(String),
						materialType: expect.any(String),
						sellPrice: expect.any(Number),
						buybackPrice: expect.any(Number),
						weight: expect.any(Number),
						weightUnit: expect.any(String),
					});

					expect(item.material).not.toBe('');
					expect(item.sellPrice).toBeGreaterThan(0);
					expect(item.buybackPrice).toBeGreaterThan(0);
				}
			}
		});
	});

	describe('error cases', () => {
		it('should handle invalid URL gracefully', async () => {
			const invalidConfig = {
				engine: 'cheerio' as const,
				currency: 'IDR',
				url: 'https://this-url-does-not-exist-12345.com',
				items: [
					{
						selector: {
							sellPrice: '.sellPrice',
							buybackPrice: '.buybackPrice',
						},
					},
				],
			};
			const scraper = new CheerioScraper('invalid-test', invalidConfig);
			const result = await scraper.scrape();

			expect(result.success).toBe(false);
			expect(result.error).toBeTruthy();
		});

		it('should handle 404 response', async () => {
			const notFoundConfig = {
				engine: 'cheerio' as const,
				currency: 'IDR',
				url: 'https://www.anekalogam.co.id/page-does-not-exist',
				items: [
					{
						selector: {
							sellPrice: '.sellPrice',
							buybackPrice: '.buybackPrice',
						},
					},
				],
			};
			const scraper = new CheerioScraper('not-found-test', notFoundConfig);
			const result = await scraper.scrape();

			expect(result.success).toBe(false);
		});
	});
});
