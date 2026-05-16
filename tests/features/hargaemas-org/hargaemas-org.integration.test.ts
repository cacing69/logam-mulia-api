import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HtmlScraper, parseCurrency } from '../../../src/lib';
import { hargaemasOrgConfig } from '../../../src/features/hargaemas-org/config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

describe('HargaEmas.org Integration Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should scrape sellPrice and buybackPrice from table rows', async () => {
		const mockHtml = `
			<html>
				<head><title>Harga Emas Hari Ini</title></head>
				<body>
					<table class="HistoryAntamTable_table">
						<thead>
							<tr>
								<th><span>Gram</span></th>
								<th><span>Antam</span></th>
								<th><span>Pegadaian</span></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="HistoryAntamTable_gram-list"><p>1 gr</p></td>
								<td><p>Rp2.640.551</p></td>
								<td><p>Rp2.531.927</p></td>
							</tr>
							<tr>
								<td class="HistoryAntamTable_gram-list"><p>2 gr</p></td>
								<td><p>Rp5.281.102</p></td>
								<td><p>Rp5.063.854</p></td>
							</tr>
							<tr>
								<td colspan="3"><p>pembelian kembali: Rp2.531.927</p></td>
							</tr>
						</tbody>
					</table>
				</body>
			</html>
		`;

		vi.mocked(global.fetch).mockResolvedValueOnce({
			ok: true,
			status: 200,
			text: async () => mockHtml,
		} as Response);

		const scraper = new HtmlScraper('hargaemas-org', hargaemasOrgConfig);

		const result = await scraper.scrape((raw) => ({
			material: raw.material || 'gold',
			materialType: raw.materialType || 'unknown',
			buybackPrice: parseCurrency(raw.buybackPrice),
			sellPrice: parseCurrency(raw.sellPrice),
			weight: raw.weight ? Number(raw.weight) : 1,
			weightUnit: raw.weightUnit || 'gr',
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
			material: expect.any(String),
			sellPrice: expect.any(Number),
			weightUnit: expect.any(String),
		});

		expect(firstItem.sellPrice).toBeGreaterThan(0);
	});
});
