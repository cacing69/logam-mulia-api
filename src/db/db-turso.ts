import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { and, eq, sql } from 'drizzle-orm';
import { priceHistory } from './schema/turso';
import type { PriceStore } from './types';
import type { PriceRow } from '../lib/utils/price-response';

export class DbTurso implements PriceStore {
	private db: ReturnType<typeof drizzle>;

	constructor(url: string, authToken: string) {
		const client = createClient({ url, authToken });
		this.db = drizzle(client);
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
			meta: null,
		}));
	}

	async deleteToday(source: string, date: string): Promise<void> {
		await this.db
			.delete(priceHistory)
			.where(and(eq(priceHistory.source, source), eq(priceHistory.recordedDate, date)));
	}

	async insert(rows: PriceRow[]): Promise<void> {
		if (rows.length === 0) {
			return;
		}

		await this.db
			.insert(priceHistory)
			.values(
				rows.map((row) => ({
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
				})),
			)
			.onConflictDoUpdate({
				target: [
					priceHistory.source,
					priceHistory.recordedDate,
					priceHistory.materialType,
					priceHistory.weight,
					priceHistory.weightUnit,
				],
				set: {
					material: sql`excluded.material`,
					sellPrice: sql`excluded.sell_price`,
					buybackPrice: sql`excluded.buyback_price`,
					currency: sql`excluded.currency`,
					createdAt: sql`excluded.created_at`,
				},
			});
	}
}
