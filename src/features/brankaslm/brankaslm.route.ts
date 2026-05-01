import { Hono } from 'hono';
import { brankaslmConfig } from './brankaslm.config';

const app = new Hono();

function parseCurrency(value: string): number {
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
		const response = await fetch(brankaslmConfig.proxyUrl, {
			headers: { Accept: 'text/markdown' },
			signal: AbortSignal.timeout(15000),
		});

		if (!response.ok) {
			return c.json(
				{
					success: false,
					error: `Proxy request failed: HTTP ${response.status}`,
					timestamp,
					source: 'brankaslm',
					currency: brankaslmConfig.currency,
				},
				502
			);
		}

		const markdown = await response.text();

		const korporatRaw = extractPrice(markdown, 'Harga Beli Emas BRANKAS Korporat');
		const fisikRaw = extractPrice(markdown, 'Harga Beli Emas Fisik');
		const updateMatch = markdown.match(/Terakhir diperbarui\s*:\s*(.+)/i);
		const info = updateMatch ? updateMatch[1].trim() : '';

		const items = [];

		if (fisikRaw) {
			items.push({
				type: 'emas fisik',
				buy: parseCurrency(fisikRaw),
				sell: null,
				info,
				buyRaw: fisikRaw,
				sellRaw: null,
			});
		}

		if (korporatRaw) {
			items.push({
				type: 'emas korporat',
				buy: parseCurrency(korporatRaw),
				sell: null,
				info,
				buyRaw: korporatRaw,
				sellRaw: null,
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
