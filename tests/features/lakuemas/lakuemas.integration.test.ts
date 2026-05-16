import { beforeEach, describe, expect, it, vi } from 'vitest';
import app from '../../../src/features/api/prices/lakuemas/route';

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

		const res = await app.request('/', undefined, {
			JINA_API_KEY: 'test-key',
			TURSO_DATABASE_URL: undefined,
			TURSO_AUTH_TOKEN: undefined,
		});
		const result = await res.json();

		expect(result.success).toBe(true);
		expect(result.data).toHaveLength(1);

		const firstItem = result.data[0];
		expect(firstItem.material).toBe('gold');
		expect(firstItem.materialType).toBe('Laku Emas');
		expect(firstItem.sellPrice).toBe(2566000);
		expect(firstItem.buybackPrice).toBe(2639000);
		expect(firstItem.weight).toBe(1);
		expect(firstItem.weightUnit).toBe('gr');
	});
});
