import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheerioScraper, parseCurrency } from '../../../src/lib';
import { kursdolarConfig } from '../../../src/features/kursdolar/kursdolar.config';

function isArrayData<T>(data: T | T[] | undefined): data is T[] {
	return Array.isArray(data);
}

global.fetch = vi.fn();

/**
 * Struktur selaras dengan halaman AMP / HTML aktual kurs.dollar.web.id:
 * `#main > div` → anak ke-7 `div[itemscope][itemtype="http://schema.org/Table"]` berisi
 * tabel spot, small, iklan, hr, h2 BSI, **tabel BSI** (`table:nth-child(6)`).
 */
function buildKursdolarMockHtml(): string {
	return `
<!DOCTYPE html>
<html lang="id">
<head><meta charset="utf-8"><title>Harga Emas dan Logam Mulia Hari Ini</title></head>
<body itemscope itemtype="http://schema.org/WebPage">
<div id="breadcrumb"><a href="#">Home</a></div><br/>
<div id="main">
  <div itemprop="image" itemscope itemtype="https://schema.org/ImageObject">
  <a href="https://kurs.dollar.web.id"><img src="images/kurs-dollar.png" width="270" height="44" alt="Kurs" /></a>
  <meta itemprop="url" content="https://kurs.dollar.web.id/images/kurs-dollar.png">
  <div class="nav"><div class="menu"><ul><li><a href="#">Home</a></li></ul></div></div>
  <br/>
  <h1 itemprop="headline">Harga Emas Hari Ini dan Logam Mulia</h1>
  <div class="iklan"></div>
  <div itemscope itemtype="http://schema.org/Table">
    <table cellspacing="0">
      <tr class="dark"><th class="bold">Logam Mulia</th><th class="bold">Buyback Rp/gr.</th><th class="bold">Lantakan Rp/gr.</th></tr>
      <tr class="lite"><td class="bold">Emas</td><td>1.267.271</td><td>1.393.998</td></tr>
      <tr class="dark"><td class="bold">Perak</td><td>14.979</td><td>16.477</td></tr>
      <tr class="lite"><td class="bold">Platina</td><td>508.099</td><td>558.909</td></tr>
      <tr class="dark"><td class="bold">Paladium</td><td>472.692</td><td>519.961</td></tr>
    </table>
    <small>Update: 01-05-2026 15:59 WIB</small>
    <div class="iklan"></div>
    <hr />
    <h2>Harga Emas Bank BSI (Bank Syariah Indonesia)</h2>
    <table cellspacing="0">
      <tr class="dark">
        <th class="bold">Logam Mulia<br/>(Per Gram)</th>
        <th class="bold">Harga Jual<br/>(Rp)</th>
        <th class="bold">Harga Beli<br/>(Rp)</th>
      </tr>
      <tr class="lite"><td class="bold">1</td><td>882.000</td><td>988.428</td></tr>
      <tr class="dark"><td class="bold">2</td><td>1.802.000</td><td>1.996.946</td></tr>
      <tr class="lite"><td class="bold">2.5</td><td>2.252.500</td><td>2.486.138</td></tr>
      <tr class="dark"><td class="bold">3</td><td>2.703.000</td><td>2.970.307</td></tr>
      <tr class="lite"><td class="bold">4</td><td>3.604.000</td><td>3.938.644</td></tr>
      <tr class="dark"><td class="bold">5</td><td>4.505.000</td><td>4.917.028</td></tr>
      <tr class="lite"><td class="bold">10</td><td>9.010.000</td><td>9.778.808</td></tr>
      <tr class="dark"><td class="bold">25</td><td>22.525.000</td><td>24.320.954</td></tr>
      <tr class="lite"><td class="bold">50</td><td>45.050.000</td><td>48.562.553</td></tr>
      <tr class="dark"><td class="bold">100</td><td>90.100.000</td><td>97.046.754</td></tr>
      <tr class="lite"><td class="bold">250</td><td>225.250.000</td><td>242.350.693</td></tr>
      <tr class="dark"><td class="bold">500</td><td>470.500.000</td><td>499.557.940</td></tr>
    </table>
    <small>Update: 01-05-2026 15:59 WIB</small>
  </div>
  </div>
</div>
</body>
</html>
    `;
}

describe('Kursdolar Unit Tests', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('should parse BSI per-gram row (Harga Jual / Harga Beli) from nested table', async () => {
		const mockHtml = buildKursdolarMockHtml();

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

		const { items } = kursdolarConfig;
		if (!items?.length) {
			throw new Error('kursdolarConfig.items must be a non-empty array');
		}
		expect(result.data.length).toBe(items.length);

		const firstItem = result.data[0];
		expect(firstItem.material).toBe('gold');
		expect(firstItem.materialType).toBe('Emas Bank BSI');
		expect(firstItem.sellPrice).toBe(882000);
		expect(firstItem.buybackPrice).toBe(988428);
		expect(firstItem.weight).toBe(1);
		expect(firstItem.weightUnit).toBe('gr');

		const row2_5g = result.data[2];
		expect(row2_5g.weight).toBe(2.5);
		expect(row2_5g.sellPrice).toBe(2252500);
	});
});
