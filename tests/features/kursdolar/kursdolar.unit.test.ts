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
			material: raw.material || 'gold',
			materialType: raw.materialType || 'unknown',
			buybackPrice: parseCurrency(raw.buybackPrice),
			sellPrice: parseCurrency(raw.sellPrice),
			weight: raw.weight ? Number(raw.weight) : 1,
			weightUnit: raw.weightUnit || 'gr',
		}));

		expect(result.success).toBe(true);
		expect(result.source).toBe('kursdolar');
		expect(result.currency).toBe('IDR');
		expect(isArrayData(result.data)).toBe(true);

		if (!isArrayData(result.data) || result.data.length === 0) {
			throw new Error('Expected non-empty array data');
		}

		const firstItem = result.data[0];
		expect(firstItem.material).toBe('gold');
		expect(firstItem.materialType).toBe('unknown');
		expect(firstItem.sellPrice).toBe(1267271);
		expect(firstItem.buybackPrice).toBe(1393998);
		expect(firstItem.weight).toBe(1);
		expect(firstItem.weightUnit).toBe('gr');
	});
});
