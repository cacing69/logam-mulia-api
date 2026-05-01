import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { hargaemasOrgConfig } from '../../../src/features/hargaemas-org/hargaemas-org.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('HargaEmas.org Integration Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should scrape and split sell/buy values from raw price text', async () => {
		const mockHtml = `
      <html>
        <head><title>Harga Emas Hari Ini</title></head>
        <body>
          <main>
            <div class="layout_footer-buy-sell-wrapper__8es4r">
              <div>
                <div class="layout_content__49Kn9">
                  <div class="layout_light-text__rQYRl">Rp2.531.927/g | Rp2.640.551/g</div>
                </div>
              </div>
            </div>
          </main>
        </body>
      </html>
    `;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockHtml,
		} as Response);

		const scraper = new CheerioScraper('hargaemas-org', hargaemasOrgConfig);

		const result = await scraper.scrape((raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: parseCurrency(raw.buy),
			sellRaw: raw.sell,
			buyRaw: raw.buy,
			info: raw.info,
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('hargaemas-org');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem).toMatchObject({
			type: expect.any(String),
			sell: expect.any(Number),
			buy: expect.any(Number),
			sellRaw: expect.any(String),
			buyRaw: expect.any(String),
		});

		expect(firstItem.sell).toBeGreaterThan(0);
		expect(firstItem.buy).toBeGreaterThan(0);
		expect(firstItem.sellRaw.length).toBeGreaterThan(0);
		expect(firstItem.buyRaw.length).toBeGreaterThan(0);
	});
});
