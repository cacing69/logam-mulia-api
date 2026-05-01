import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { kursdolarConfig } from '../../../src/features/kursdolar/kursdolar.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('Kursdolar Unit Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should parse Emas row buyback and lantakan values from table', async () => {
		const mockHtml = `
      <html>
        <body>
          <h1>Harga Emas Hari Ini dan Logam Mulia</h1>
          <table cellspacing="0">
            <tr class="dark">
              <th class="bold">Logam Mulia</th>
              <th class="bold">Buyback Rp/gr.</th>
              <th class="bold">Lantakan Rp/gr.</th>
            </tr>
            <tr class="lite">
              <td class="bold">Emas</td>
              <td>1.267.271</td>
              <td>1.393.998</td>
            </tr>
          </table>
        </body>
      </html>
    `;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockHtml,
		} as Response);

		const scraper = new CheerioScraper('kursdolar', kursdolarConfig);
		const result = await scraper.scrape((raw) => ({
			type: raw.type || 'unknown',
			sell: parseCurrency(raw.sell),
			buy: parseCurrency(raw.buy),
			info: raw.info,
			sellRaw: raw.sell,
			buyRaw: raw.buy,
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('kursdolar');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.type).toBe('emas');
		expect(firstItem.buyRaw).toBe('1.267.271');
		expect(firstItem.sellRaw).toBe('1.393.998');
		expect(firstItem.buy).toBe(1267271);
		expect(firstItem.sell).toBe(1393998);
		expect(firstItem.info).toContain('Harga Emas Hari Ini');
	});
});
