import type { ScrapingConfig } from '../../lib/types/scraper.types';
import { raw } from '../../lib/types/scraper.types';

export const lakuemasConfig: ScrapingConfig<'sell' | 'buy' | 'type' | 'info'> = {
	engine: 'cheerio',
	currency: 'IDR',
	active: true,
	items: [
		{
			url: 'https://r.jina.ai/http://lakuemas.com/harga',
			selector: {
				sell: 'body',
				buy: 'body',
				type: raw('lakuemas'),
				info: raw(`Harga Jual Emas Antam Hari Ini`),
			},
			postProcess: (rawData) => {
				const text = rawData.sell ?? '';
				const jualMatch = text.match(/##\s*HARGA JUAL EMAS HARI INI[\s\S]*?###\s*\*\*(IDR\s*[\d,.-]+)\*\*/i);
				const beliMatch = text.match(/##\s*HARGA BELI EMAS HARI INI[\s\S]*?###\s*\*\*(IDR\s*[\d,.-]+)\*\*/i);

				const normalizedJual = jualMatch?.[1]?.trim() ?? '';
				const normalizedBeli = beliMatch?.[1]?.trim() ?? '';

				// Fallback jika format heading berubah di konten jina.
				const fallbackMatches = [...text.matchAll(/IDR\s*([\d,]+),-\s*\/\s*Gram/gi)];
				const fallbackBeli = fallbackMatches[0]?.[1] ? `IDR ${fallbackMatches[0][1]},-` : '';
				const fallbackJual = fallbackMatches[1]?.[1] ? `IDR ${fallbackMatches[1][1]},-` : '';

				return {
					sell: normalizedJual || fallbackJual,
					buy: normalizedBeli || fallbackBeli,
					type: rawData.type ?? 'lakuemas',
					info: rawData.info ?? '',
				};
			},
		},
	],
};
