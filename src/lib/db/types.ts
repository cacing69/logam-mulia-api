import type { PriceRow } from '../utils/price-response';

export interface PriceStore {
	getToday(source: string, date: string): Promise<PriceRow[]>;
	deleteToday(source: string, date: string): Promise<void>;
	insert(rows: PriceRow[]): Promise<void>;
}
