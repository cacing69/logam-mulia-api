import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { sakumasConfig } from '../../../src/features/sakumas/sakumas.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('Sakumas Unit Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should parse buy/sell and info from sakumas html selectors', async () => {
		const mockHtml = `
      <html>
        <head><title>Sakumas</title></head>
        <body>
          <div class="container hargaEmasContainer">
            <div class="hargaTitle">Harga <span>Emas</span> Hari Ini</div>
            <div class="hargaTitle" id="hargaBeli">979.278</div>
            <div class="hargaTitle" id="hargaJual">950.755</div>
          </div>
        </body>
      </html>
    `;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockHtml,
		} as Response);

		const scraper = new CheerioScraper('sakumas', sakumasConfig);
		const result = await scraper.scrape((raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: parseCurrency(raw.buy),
			info: raw.info,
			sellRaw: raw.sell,
			buyRaw: raw.buy,
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('sakumas');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.type).toBe('sakumas');
		expect(firstItem.sellRaw).toBe('950.755');
		expect(firstItem.buyRaw).toBe('979.278');
		expect(firstItem.sell).toBe(950755);
		expect(firstItem.buy).toBe(979278);
		expect(firstItem.info).toContain('Harga');
	});
});
