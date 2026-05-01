import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../../src/features/lakuemas/lakuemas.route';

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

		const res = await app.request('/', undefined, { JINA_API_KEY: 'test-key' });
		const result = await res.json();

		expect(result.success).toBe(true);
		expect(result.source).toBe('lakuemas');
		expect(result.currency).toBe('IDR');
		expect(result.data).toHaveLength(1);

		const firstItem = result.data[0];
		expect(firstItem.sellRaw).toBe('IDR 2,566,000,-');
		expect(firstItem.buyRaw).toBe('IDR 2,639,000,-');
		expect(firstItem.sell).toBe(2566000);
		expect(firstItem.buy).toBe(2639000);
	});
});
