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
		let d1Missed = false;
		if (this.dbD1) {
			try {
				const fromD1 = await this.dbD1.getToday(source, date);
				if (fromD1.length > 0) {
					return fromD1;
				}
				d1Missed = true;
			} catch (err) {
				console.error(`[repo] getToday D1 error for ${source}:`, err);
				d1Missed = true;
			}
		}
		if (this.dbTurso) {
			try {
				const fromTurso = await this.dbTurso.getToday(source, date);
				// Turso punya hari ini tapi D1 kosong/error → response di-cache dari Turso tanpa scrape;
				// tanpa backfill, D1 tidak pernah terisi (mis. upsert D1 gagal tapi Turso berhasil).
				if (fromTurso.length > 0 && d1Missed && this.dbD1) {
					await this.dbD1.insert(fromTurso);
				}
				return fromTurso;
			} catch (err) {
				console.error(`[repo] getToday Turso error for ${source}:`, err);
				return [];
			}
		}
		return [];
	}

	async insert(rows: PriceRow[]): Promise<void> {
		if (rows.length === 0) {
			return;
		}

		// Turso dulu: kalau gagal, D1 belum ditulis (hindari partial). D1 di-chunk di DbD1 (batas 100 parameter/query).
		if (this.dbTurso) {
			await this.dbTurso.insert(rows);
		}

		if (this.dbD1) {
			await this.dbD1.insert(rows);
		} else {
			console.warn('[repo] D1 upsert skipped: env.DB_D1 tidak ada (cek binding wrangler / deploy)');
		}
	}

	/** Hapus semua baris `source` + `recorded_date === date` di D1 dan Turso. */
	async deleteToday(source: string, date: string): Promise<void> {
		const tasks: Promise<void>[] = [];
		if (this.dbD1) {
			tasks.push(this.dbD1.deleteToday(source, date));
		}
		if (this.dbTurso) {
			tasks.push(this.dbTurso.deleteToday(source, date));
		}
		await Promise.all(tasks);
	}

	/**
	 * Jalur `?refresh=true`: hapus hari ini di Turso → paralel (Turso insert | D1 batch delete+insert+prune).
	 * Hapus Turso dilakukan sebelum paralel; scrape harus sudah sukses di pemanggil.
	 */
	async refreshWrite(source: string, date: string, rows: PriceRow[]): Promise<void> {
		if (this.dbTurso) {
			await this.dbTurso.deleteToday(source, date);
		}

		const parallel: Promise<void>[] = [];
		if (this.dbTurso && rows.length > 0) {
			parallel.push(this.dbTurso.insert(rows));
		}
		if (this.dbD1) {
			parallel.push(this.dbD1.replaceTodayAndPrune(source, date, rows));
		} else if (rows.length > 0) {
			console.warn('[repo] D1 upsert skipped: env.DB_D1 tidak ada (cek binding wrangler / deploy)');
		}
		await Promise.all(parallel);
	}

	/** D1 saja: buang baris `source` dengan `recorded_date` sebelum `recordedDate` (setelah upsert hari ini). */
	async pruneD1HistoryBeforeRecordedDate(source: string, recordedDate: string): Promise<void> {
		if (!this.dbD1) {
			return;
		}
		await this.dbD1.deleteSourceRecordedDateStrictlyBefore(source, recordedDate).catch((err) => {
			console.error('[repo] D1 prune history error:', err);
		});
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
