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

	it('should parse buyback/sell price from sakumas html selectors', async () => {
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
			material: raw.material || 'gold',
			materialType: raw.materialType || 'unknown',
			buybackPrice: parseCurrency(raw.buybackPrice),
			sellPrice: parseCurrency(raw.sellPrice),
			weight: raw.weight ? Number(raw.weight) : 1,
			weightUnit: raw.weightUnit || 'gr',
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('sakumas');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.material).toBe('gold');
		expect(firstItem.materialType).toBe('unknown');
		expect(firstItem.sellPrice).toBe(979278);
		expect(firstItem.buybackPrice).toBe(950755);
		expect(firstItem.weight).toBe(1);
		expect(firstItem.weightUnit).toBe('gr');
	});
});
