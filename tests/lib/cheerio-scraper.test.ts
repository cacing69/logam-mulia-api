import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HtmlScraper } from '../../src/lib/scrapers/html-scraper';
import { raw } from '../../src/lib/types/scraper.types';

global.fetch = vi.fn();

function mockHtml(html: string) {
	vi.mocked(global.fetch).mockResolvedValueOnce({
		ok: true,
		status: 200,
		text: async () => html,
	} as Response);
}

describe('HtmlScraper', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('extracts text from CSS selectors', async () => {
		mockHtml(`
			<div class="buy">Rp1.000.000</div>
			<div class="sell">Rp1.050.000</div>
		`);

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			selector: { buy: '.buy', sell: '.sell' },
		});

		const result = await scraper.scrape();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({ buy: 'Rp1.000.000', sell: 'Rp1.050.000' });
	});

	it('extracts inner HTML with html: prefix', async () => {
		mockHtml(`<div class="content"><span>hello</span></div>`);

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			selector: { content: 'html:.content' },
		});

		const result = await scraper.scrape();

		expect(result.success).toBe(true);
		expect(result.data).toEqual({ content: '<span>hello</span>' });
	});

	it('applies transformer to raw data', async () => {
		mockHtml(`
			<div class="buy">1000000</div>
			<div class="sell">1050000</div>
		`);

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			selector: { buy: '.buy', sell: '.sell' },
		});

		const result = await scraper.scrape((raw) => ({
			buy: Number(raw.buy),
			sell: Number(raw.sell),
		}));

		expect(result.success).toBe(true);
		expect(result.data).toEqual({ buy: 1000000, sell: 1050000 });
	});

	it('returns error when fetch fails', async () => {
		vi.mocked(global.fetch).mockRejectedValueOnce(new Error('Network error'));

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			selector: { buy: '.buy' },
		});

		const result = await scraper.scrape();

		expect(result.success).toBe(false);
	});

	it('returns inactive when active is false', async () => {
		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			active: false,
			selector: { buy: '.buy' },
		});

		const result = await scraper.scrape();

		expect(result.success).toBe(false);
		expect(result).toHaveProperty('inactive', true);
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it('supports items[] with multiple selectors per URL', async () => {
		mockHtml(`
			<div class="gold-buy">1.000.000</div>
			<div class="gold-sell">1.050.000</div>
		`);

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			items: [
				{
					selector: { type: raw('Antam'), buy: '.gold-buy', sell: '.gold-sell' },
				},
			],
		});

		const result = await scraper.scrape();

		expect(result.success).toBe(true);
		expect(result.count).toBe(1);
		expect(result.data).toEqual([
			{ type: 'Antam', buy: '1.000.000', sell: '1.050.000' },
		]);
	});

	it('applies postProcess to item selectors', async () => {
		mockHtml(`<div class="price">Rp 1.000.000</div>`);

		const scraper = new HtmlScraper('test', {
			name: 'test',
			url: 'https://example.com',
			engine: 'cheerio',
			currency: 'IDR',
			items: [
				{
					selector: { price: '.price' },
					postProcess: (raw) => ({
						...raw,
						price: raw.price.replace(/\D/g, ''),
					}),
				},
			],
		});

		const result = await scraper.scrape();
		const data = result.data as Record<string, string>[];

		expect(result.success).toBe(true);
		expect(data[0].price).toBe('1000000');
	});
});
