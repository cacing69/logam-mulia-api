import { createPriceRepository } from '../db';
import { jakartaCalendarDateString } from './utils/calendar-date';
import { normalizePriceRows, type PriceRow } from './utils/price-response';

export interface PublicPriceHistoryRow {
	source: string;
	material: string;
	materialType: string;
	weight: number;
	weightUnit: string;
	sellPrice: number;
	buybackPrice: number | null;
	currency: string;
	recordedDate: string;
	/** Kunci stabil per baris scrape; string kosong jika sumber tidak membedakan. */
	lineKey: string;
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
		recordedDate: row.recordedDate,
		lineKey: row.lineKey,
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
	const today = jakartaCalendarDateString();
	const repo = createPriceRepository(env);
	const shouldRefresh = options.refresh === true;

	// 1. Refresh paksa: hapus baris `source` + tanggal akses (hari ini, Jakarta) di D1 dan Turso.
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

	// 3. Normalize + bucket tanggal Jakarta
	const normalizedRows = normalizePriceRows(result.data, {
		source,
		currency: result.currency,
		recordedAt: result.timestamp,
		recordedDate: today,
	});

	// 4. Upsert (UNIQUE source + recorded_date + material + berat) — konkuren aman di level DB
	await repo.insert(normalizedRows);
	// 5. D1 “daily”: setelah hari ini tersimpan, buang baris `source` dengan recorded_date < hari ini (Turso tidak di-prune).
	await repo.pruneD1HistoryBeforeRecordedDate(source, today);
	const publicRows = toPublicRows(normalizedRows);

	return {
		success: true,
		data: publicRows,
		count: publicRows.length,
		timestamp: normalizedRows[0]?.createdAt ?? result.timestamp,
		cached: false,
	};
}
