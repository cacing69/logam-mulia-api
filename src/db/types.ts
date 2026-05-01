import type { GoldPriceRow } from '../lib/utils/price-response';

export interface HistoryRecord {
	source: string;
	goldType: string;
	weight: number;
	weightUnit: string;
	sellPrice: number;
	buybackPrice: number | null;
	currency: string;
	recordedAt: number;
	createdAt: number;
}

export interface HistoryStore {
	insertHistory(rows: GoldPriceRow[]): Promise<void>;
}

export interface DailyCacheStore {
	getDaily(source: string, date: string): Promise<HistoryRecord[]>;
	setDaily(source: string, date: string, rows: GoldPriceRow[]): Promise<void>;
}
