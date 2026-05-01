import type { DailyCacheStore, HistoryStore, HistoryRecord } from './types';
import type { GoldPriceRow } from '../lib/utils/price-response';

function toRecord(row: GoldPriceRow, now: number): HistoryRecord {
	return {
		source: row.source,
		goldType: row.gold_type,
		weight: row.weight,
		weightUnit: row.weight_unit,
		sellPrice: row.price,
		buybackPrice: row.buyback_price ?? null,
		currency: row.currency,
		recordedAt: row.recorded_at,
		createdAt: now,
	};
}

export class DbD1 implements DailyCacheStore, HistoryStore {
	constructor(private db: D1Database) {}

	// --- DailyCacheStore ---

	async getDaily(source: string, date: string): Promise<HistoryRecord[]> {
		const result = await this.db
			.prepare(
				'SELECT source, gold_type, weight, weight_unit, sell_price, buyback_price, currency, recorded_at, created_at FROM price_daily WHERE source = ?1 AND date(created_at, "unixepoch") = ?2',
			)
			.bind(source, date)
			.all<Record<string, unknown>>();

		if (!result.results?.length) return [];

		return result.results.map((row) => ({
			source: row.source as string,
			goldType: row.gold_type as string,
			weight: row.weight as number,
			weightUnit: row.weight_unit as string,
			sellPrice: row.sell_price as number,
			buybackPrice: (row.buyback_price as number) ?? null,
			currency: row.currency as string,
			recordedAt: row.recorded_at as number,
			createdAt: row.created_at as number,
		}));
	}

	async setDaily(source: string, date: string, rows: GoldPriceRow[]): Promise<void> {
		if (rows.length === 0) return;

		const now = Math.trunc(Date.now() / 1000);

		// Delete existing daily records for this source+date, then insert fresh
		const deleteStmt = this.db
			.prepare('DELETE FROM price_daily WHERE source = ?1 AND date(created_at, "unixepoch") = ?2')
			.bind(source, date);

		const insertStmts = rows.map((row) => {
			const r = toRecord(row, now);
			return this.db
				.prepare(
					`INSERT INTO price_daily (source, gold_type, weight, weight_unit, sell_price, buyback_price, currency, recorded_at, created_at)
					 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
				)
				.bind(r.source, r.goldType, r.weight, r.weightUnit, r.sellPrice, r.buybackPrice, r.currency, r.recordedAt, r.createdAt);
		});

		await this.db.batch([deleteStmt, ...insertStmts]);
	}

	// --- HistoryStore ---

	async insertHistory(rows: GoldPriceRow[]): Promise<void> {
		if (rows.length === 0) return;

		const now = Math.trunc(Date.now() / 1000);

		const stmts = rows.map((row) => {
			const r = toRecord(row, now);
			return this.db
				.prepare(
					`INSERT INTO price_history (source, gold_type, weight, weight_unit, sell_price, buyback_price, currency, recorded_at, created_at)
					 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)`,
				)
				.bind(r.source, r.goldType, r.weight, r.weightUnit, r.sellPrice, r.buybackPrice, r.currency, r.recordedAt, r.createdAt);
		});

		await this.db.batch(stmts);
	}
}
