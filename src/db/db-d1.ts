import { drizzle } from 'drizzle-orm/d1';
import { and, eq, lt, sql } from 'drizzle-orm';
import { priceHistory } from './schema/d1';
import type { PriceStore } from './types';
import type { PriceRow } from '../lib/utils/price-response';

/** D1: max 100 bound parameters per query (https://developers.cloudflare.com/d1/platform/limits/). */
const D1_MAX_BOUND_PARAMS = 100;
/** Kolom terikat per baris di `insert(priceHistory).values(...)` (bukan literal `excluded.*` di ON CONFLICT). */
const INSERT_VALUE_PARAM_COUNT = 11;
const PRICE_HISTORY_ROWS_PER_INSERT = Math.max(
	1,
	Math.floor(D1_MAX_BOUND_PARAMS / INSERT_VALUE_PARAM_COUNT) - 1,
);

function toPriceHistoryValues(rows: PriceRow[]) {
	return rows.map((row) => ({
		source: row.source,
		material: row.material,
		materialType: row.materialType,
		weight: row.weight,
		weightUnit: row.weightUnit,
		sellPrice: row.sellPrice,
		buybackPrice: row.buybackPrice ?? null,
		currency: row.currency,
		recordedDate: row.recordedDate,
		createdAt: row.createdAt,
		lineKey: row.lineKey || '',
	}));
}

export class DbD1 implements PriceStore {
	private db: ReturnType<typeof drizzle>;

	constructor(d1: D1Database) {
		this.db = drizzle(d1);
	}

	async getToday(source: string, date: string): Promise<PriceRow[]> {
		const results = await this.db
			.select()
			.from(priceHistory)
			.where(and(eq(priceHistory.source, source), eq(priceHistory.recordedDate, date)));

		return results.map((r) => ({
			source: r.source,
			material: r.material,
			materialType: r.materialType,
			weight: r.weight,
			weightUnit: r.weightUnit,
			sellPrice: r.sellPrice,
			buybackPrice: r.buybackPrice,
			currency: r.currency,
			recordedDate: r.recordedDate,
			createdAt: r.createdAt,
			lineKey: r.lineKey ?? '',
			meta: null,
		}));
	}

	async deleteToday(source: string, date: string): Promise<void> {
		await this.db
			.delete(priceHistory)
			.where(and(eq(priceHistory.source, source), eq(priceHistory.recordedDate, date)));
	}

	/** D1 daily: hapus riwayat `source` dengan `recorded_date` sebelum `beforeDate` (`YYYY-MM-DD`). */
	async deleteSourceRecordedDateStrictlyBefore(source: string, beforeDate: string): Promise<void> {
		await this.db
			.delete(priceHistory)
			.where(and(eq(priceHistory.source, source), lt(priceHistory.recordedDate, beforeDate)));
	}

	private insertChunkBuilders(rows: PriceRow[]) {
		const builders = [];
		for (let i = 0; i < rows.length; i += PRICE_HISTORY_ROWS_PER_INSERT) {
			const chunk = rows.slice(i, i + PRICE_HISTORY_ROWS_PER_INSERT);
			builders.push(
				this.db
					.insert(priceHistory)
					.values(toPriceHistoryValues(chunk))
					.onConflictDoUpdate({
						target: [
							priceHistory.source,
							priceHistory.recordedDate,
							priceHistory.materialType,
							priceHistory.weight,
							priceHistory.weightUnit,
							priceHistory.lineKey,
						],
						set: {
							material: sql`excluded.material`,
							sellPrice: sql`excluded.sell_price`,
							buybackPrice: sql`excluded.buyback_price`,
							currency: sql`excluded.currency`,
							createdAt: sql`excluded.created_at`,
						},
					}),
			);
		}
		return builders;
	}

	async insert(rows: PriceRow[]): Promise<void> {
		if (rows.length === 0) {
			return;
		}

		for (const q of this.insertChunkBuilders(rows)) {
			await q;
		}
	}

	/**
	 * Satu `db.batch` D1: hapus hari ini → insert (chunk) → prune tanggal lama.
	 * Dipakai `?refresh=true` supaya satu transaksi D1 + tidak hapus DB sebelum scrape sukses.
	 */
	async replaceTodayAndPrune(source: string, date: string, rows: PriceRow[]): Promise<void> {
		const delToday = this.db
			.delete(priceHistory)
			.where(and(eq(priceHistory.source, source), eq(priceHistory.recordedDate, date)));

		const prune = this.db
			.delete(priceHistory)
			.where(and(eq(priceHistory.source, source), lt(priceHistory.recordedDate, date)));

		const chunks = this.insertChunkBuilders(rows);
		const batchItems = [delToday, ...chunks, prune];
		await this.db.batch(batchItems as unknown as Parameters<(typeof this.db)['batch']>[0]);
	}
}
