import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { cermatiConfig } from '../../../src/features/cermati/cermati.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('Cermati Unit Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should parse 1 gram Antam price and set buy to null', async () => {
		const mockHtml = `
      <html>
        <body>
          <article itemprop="articleBody">
            <h1><strong>Harga Emas 24 Karat</strong></h1>
            <div class="table-holder">
              <table>
                <thead><tr><th>Berat</th><th>Antam</th><th>Digital</th><th></th></tr></thead>
                <tbody>
                  <tr><td>0.5 gram</td><td>1.434.500</td><td>1.277.655</td><td></td></tr>
                  <tr><td>1 gram</td><td>2.769.000</td><td>2.555.310</td><td></td></tr>
                </tbody>
              </table>
            </div>
          </article>
        </body>
      </html>
    `;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockHtml,
		} as Response);

		const scraper = new CheerioScraper('cermati', cermatiConfig);
		const result = await scraper.scrape((raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: null,
			info: raw.info,
			sellRaw: raw.sell,
			buyRaw: null,
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('cermati');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.type).toBe('cermati-antam-1g');
		expect(firstItem.sellRaw).toBe('2.769.000');
		expect(firstItem.sell).toBe(2769000);
		expect(firstItem.buy).toBeNull();
		expect(firstItem.buyRaw).toBeNull();
		expect(firstItem.info).toContain('digital_mid: 2.555.310');
	});
});
