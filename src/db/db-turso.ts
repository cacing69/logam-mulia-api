import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { priceHistory } from './schema/turso';
import type { HistoryStore, HistoryRecord } from './types';
import type { GoldPriceRow } from '../lib/utils/price-response';

export class DbTurso implements HistoryStore {
	private db: ReturnType<typeof drizzle>;

	constructor(url: string, authToken: string) {
		const client = createClient({ url, authToken });
		this.db = drizzle(client);
	}

	async insertHistory(rows: GoldPriceRow[]): Promise<void> {
		if (rows.length === 0) return;

		const now = Math.trunc(Date.now() / 1000);

		const records: HistoryRecord[] = rows.map((row) => ({
			source: row.source,
			goldType: row.gold_type,
			weight: row.weight,
			weightUnit: row.weight_unit,
			sellPrice: row.price,
			buybackPrice: row.buyback_price ?? null,
			currency: row.currency,
			recordedAt: row.recorded_at,
			createdAt: now,
		}));

		const values = records
			.map(
				(r) =>
					`('${r.source}', '${r.goldType}', ${r.weight}, '${r.weightUnit}', ${r.sellPrice}, ${r.buybackPrice ?? 'NULL'}, '${r.currency}', ${r.recordedAt}, ${r.createdAt})`,
			)
			.join(',');

		await this.db.run(
			`INSERT INTO price_history (source, gold_type, weight, weight_unit, sell_price, buyback_price, currency, recorded_at, created_at) VALUES ${values}`,
		);
	}
}
