import { Hono } from 'hono';
import { JinaScraper } from '../../lib';
import { brankaslmConfig } from './brankaslm.config';

type Bindings = { JINA_API_KEY?: string };
const app = new Hono<{ Bindings: Bindings }>();

function parseCurrencyValue(value: string): number {
	if (!value) return 0;
	const cleaned = value.replace(/[^\d]/g, '');
	return parseInt(cleaned, 10) || 0;
}

function extractPrice(text: string, label: string): string | null {
	const regex = new RegExp(`${label}\\s*(?:\\n\\s*)?(?:\\*\\*)?Rp\\s*([\\d.,]+)`, 'i');
	const match = text.match(regex);
	return match ? match[1].replace(/\./g, '') : null;
}

app.get('/', async (c) => {
	const timestamp = new Date().toISOString();

	if (!brankaslmConfig.active) {
		return c.json(
			{
				success: false,
				error: 'inactive',
				timestamp,
				source: 'brankaslm',
				currency: brankaslmConfig.currency,
			},
			400
		);
	}

	try {
		const scraper = new JinaScraper(c.env.JINA_API_KEY);
		const { text: markdown } = await scraper.fetch(brankaslmConfig.url);

		const korporatRaw = extractPrice(markdown, 'Harga Beli Emas BRANKAS Korporat');
		const fisikRaw = extractPrice(markdown, 'Harga Beli Emas Fisik');
		const updateMatch = markdown.match(/Terakhir diperbarui\s*:\s*(.+)/i);
		const info = updateMatch ? updateMatch[1].trim() : '';

		const items = [];

		if (fisikRaw) {
			items.push({
				type: 'emas fisik',
				buy: parseCurrencyValue(fisikRaw),
				sell: null,
				info,
			});
		}

		if (korporatRaw) {
			items.push({
				type: 'emas korporat',
				buy: parseCurrencyValue(korporatRaw),
				sell: null,
				info,
			});
		}

		if (items.length === 0) {
			return c.json(
				{
					success: false,
					error: 'No prices found in page content',
					timestamp,
					source: 'brankaslm',
					currency: brankaslmConfig.currency,
				},
				502
			);
		}

		return c.json({
			success: true,
			data: items,
			count: items.length,
			timestamp,
			source: 'brankaslm',
			currency: brankaslmConfig.currency,
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error';
		return c.json(
			{
				success: false,
				error: message,
				timestamp,
				source: 'brankaslm',
				currency: brankaslmConfig.currency,
			},
			500
		);
	}
});

export default app;
