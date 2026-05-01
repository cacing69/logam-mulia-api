import { drizzle } from 'drizzle-orm/d1';
import { sql } from 'drizzle-orm';
import { priceHistory } from './schema/d1';
import type { PriceStore } from './types';
import type { PriceRow } from '../lib/utils/price-response';

export class DbD1 implements PriceStore {
	private db: ReturnType<typeof drizzle>;

	constructor(d1: D1Database) {
		this.db = drizzle(d1);
	}

	async getToday(source: string, date: string): Promise<PriceRow[]> {
		const results = await this.db
			.select()
			.from(priceHistory)
			.where(
				sql`${priceHistory.source} = ${source} AND date(${priceHistory.createdAt}) = ${date}`,
			);

		return results.map((r) => ({
			source: r.source,
			material: r.material,
			materialType: r.materialType,
			weight: r.weight,
			weightUnit: r.weightUnit,
			sellPrice: r.sellPrice,
			buybackPrice: r.buybackPrice,
			currency: r.currency,
			createdAt: r.createdAt,
			meta: null,
		}));
	}

	async deleteToday(source: string, date: string): Promise<void> {
		await this.db
			.delete(priceHistory)
			.where(sql`${priceHistory.source} = ${source} AND date(${priceHistory.createdAt}) = ${date}`);
	}

	async insert(rows: PriceRow[]): Promise<void> {
		if (rows.length === 0) return;

		await this.db.insert(priceHistory).values(
			rows.map((row) => ({
				source: row.source,
				material: row.material,
				materialType: row.materialType,
				weight: row.weight,
				weightUnit: row.weightUnit,
				sellPrice: row.sellPrice,
				buybackPrice: row.buybackPrice ?? null,
				currency: row.currency,
				createdAt: row.createdAt,
			})),
		);
	}
}
