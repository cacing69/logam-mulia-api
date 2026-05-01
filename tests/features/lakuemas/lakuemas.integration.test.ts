import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { lakuemasConfig } from '../../../src/features/lakuemas/lakuemas.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('Lakuemas Integration Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should parse jual and beli prices from jina markdown content', async () => {
		const mockMarkdown = `
# Grafik Harga Jual & Beli Emas Hari Ini Dari Lakuemas

## HARGA BELI EMAS HARI INI
### **IDR 2,639,000,-** /  Gram

## HARGA JUAL EMAS HARI INI
### **IDR 2,566,000,-** /  Gram
`;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockMarkdown,
		} as Response);

		const scraper = new CheerioScraper('lakuemas', lakuemasConfig);
		const result = await scraper.scrape((raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: parseCurrency(raw.buy),
			sellRaw: raw.sell,
			buyRaw: raw.buy,
			info: raw.info,
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('lakuemas');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.sellRaw).toBe('IDR 2,566,000,-');
		expect(firstItem.buyRaw).toBe('IDR 2,639,000,-');
		expect(firstItem.sell).toBe(2566000);
		expect(firstItem.buy).toBe(2639000);
	});
});
