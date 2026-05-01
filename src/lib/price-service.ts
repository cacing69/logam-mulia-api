import { normalizePriceRows, type PriceRow } from './utils/price-response';
import { createPriceRepository } from '../db';

export interface PublicPriceHistoryRow {
	source: string;
	material: string;
	materialType: string;
	weight: number;
	weightUnit: string;
	sellPrice: number;
	buybackPrice: number | null;
	currency: string;
}

export interface FetchResult {
	success: boolean;
	data: PublicPriceHistoryRow[];
	count: number;
	timestamp: string;
	cached: boolean;
	error?: string;
}

function toPublicRows(rows: PriceRow[]): PublicPriceHistoryRow[] {
	return rows.map((row) => ({
		source: row.source,
		material: row.material,
		materialType: row.materialType,
		weight: row.weight,
		weightUnit: row.weightUnit,
		sellPrice: row.sellPrice,
		buybackPrice: row.buybackPrice,
		currency: row.currency,
	}));
}

export async function fetchOrCache(
	env: {
		DB_D1?: D1Database;
		TURSO_DATABASE_URL?: string;
		TURSO_AUTH_TOKEN?: string;
	},
	source: string,
	options: {
		refresh?: boolean;
	} = {},
	scrapeFn: () => Promise<{
		success: boolean;
		data?: unknown;
		error?: string;
		timestamp: string;
		source: string;
		currency?: string;
		inactive?: boolean;
	}>,
): Promise<FetchResult> {
	const today = new Date().toISOString().slice(0, 10);
	const repo = createPriceRepository(env);
	const shouldRefresh = options.refresh === true;

	// 1. Check if today's data exists in history
	if (shouldRefresh) {
		await repo.deleteToday(source, today);
	}

	const cached = shouldRefresh ? [] : await repo.getToday(source, today);
	if (!shouldRefresh && cached.length > 0) {
		const publicRows = toPublicRows(cached);
		return {
			success: true,
			data: publicRows,
			count: publicRows.length,
			timestamp: cached[0].createdAt,
			cached: true,
		};
	}

	// 2. Scrape
	const result = await scrapeFn();

	if (!result.success) {
		return {
			success: false,
			data: [],
			count: 0,
			timestamp: result.timestamp,
			cached: false,
			error: result.error,
		};
	}

	// 3. Normalize
	const normalizedRows = normalizePriceRows(result.data, {
		source,
		currency: result.currency,
		recordedAt: result.timestamp,
	});

	// 4. Insert to all databases
	await repo.insert(normalizedRows);
	const publicRows = toPublicRows(normalizedRows);

	return {
		success: true,
		data: publicRows,
		count: publicRows.length,
		timestamp: normalizedRows[0]?.createdAt ?? result.timestamp,
		cached: false,
	};
}
