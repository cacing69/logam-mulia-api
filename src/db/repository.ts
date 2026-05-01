import { DbD1 } from './db-d1';
import { DbTurso } from './db-turso';
import type { PriceRow } from '../lib/utils/price-response';

export class PriceRepository {
	private dbD1: DbD1 | null;
	private dbTurso: DbTurso | null;

	constructor(config: {
		d1?: D1Database;
		tursoUrl?: string;
		tursoAuthToken?: string;
	}) {
		this.dbD1 = config.d1 ? new DbD1(config.d1) : null;
		this.dbTurso =
			config.tursoUrl && config.tursoAuthToken
				? new DbTurso(config.tursoUrl, config.tursoAuthToken)
				: null;
	}

	async getToday(source: string, date: string): Promise<PriceRow[]> {
		if (!this.dbD1) return [];
		try {
			return await this.dbD1.getToday(source, date);
		} catch (err) {
			console.error(`[repo] getToday error for ${source}:`, err);
			return [];
		}
	}

	async insert(rows: PriceRow[]): Promise<void> {
		const tasks: Promise<void>[] = [];

		if (this.dbD1) {
			tasks.push(
				this.dbD1
					.insert(rows)
					.catch((err) => console.error('[repo] D1 insert error:', err)),
			);
		}

		if (this.dbTurso) {
			tasks.push(
				this.dbTurso
					.insert(rows)
					.catch((err) => console.error('[repo] Turso insert error:', err)),
			);
		}

		await Promise.all(tasks);
	}

	async deleteToday(source: string, date: string): Promise<void> {
		const tasks: Promise<void>[] = [];

		if (this.dbD1) {
			tasks.push(
				this.dbD1
					.deleteToday(source, date)
					.catch((err) => console.error('[repo] D1 deleteToday error:', err)),
			);
		}

		if (this.dbTurso) {
			tasks.push(
				this.dbTurso
					.deleteToday(source, date)
					.catch((err) => console.error('[repo] Turso deleteToday error:', err)),
			);
		}

		await Promise.all(tasks);
	}
}

export function createPriceRepository(env: {
	DB_D1?: D1Database;
	TURSO_DATABASE_URL?: string;
	TURSO_AUTH_TOKEN?: string;
}): PriceRepository {
	return new PriceRepository({
		d1: env.DB_D1,
		tursoUrl: env.TURSO_DATABASE_URL,
		tursoAuthToken: env.TURSO_AUTH_TOKEN,
	});
}
