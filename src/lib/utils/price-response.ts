type GenericRecord = Record<string, unknown>;

export interface GoldPriceRow {
	source: string;
	source_site: string | null;
	gold_type: string;
	weight: number;
	weight_unit: string;
	price: number;
	buyback_price: number | null;
	currency: string;
	recorded_at: number;
	meta: string | null;
}

function toNumber(value: unknown, fallback = 0): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.trunc(value);
	}

	if (typeof value === 'string') {
		const parsed = Number.parseFloat(value);
		if (Number.isFinite(parsed)) {
			return Math.trunc(parsed);
		}
	}

	return fallback;
}

function toPositiveNumber(value: unknown, fallback: number): number {
	const num = toNumber(value, fallback);
	return num > 0 ? num : fallback;
}

function toEpochSeconds(value: unknown): number {
	if (typeof value === 'number' && Number.isFinite(value)) {
		return Math.trunc(value > 1_000_000_000_000 ? value / 1000 : value);
	}

	if (typeof value === 'string') {
		const unix = Number.parseInt(value, 10);
		if (Number.isFinite(unix) && unix > 0) {
			return unix > 1_000_000_000_000 ? Math.trunc(unix / 1000) : unix;
		}

		const date = new Date(value);
		if (!Number.isNaN(date.getTime())) {
			return Math.trunc(date.getTime() / 1000);
		}
	}

	return Math.trunc(Date.now() / 1000);
}

function toMeta(value: unknown): string | null {
	if (value === null || value === undefined || value === '') {
		return null;
	}

	if (typeof value === 'string') {
		return value;
	}

	try {
		return JSON.stringify(value);
	} catch {
		return String(value);
	}
}

export function normalizeGoldPriceRows(
	data: unknown,
	params: {
		source: string;
		currency?: string;
		recordedAt?: string | number;
		sourceSite?: string | null;
	}
): GoldPriceRow[] {
	const list = Array.isArray(data) ? data : [data];
	const recordedAt = toEpochSeconds(params.recordedAt);
	const currency = params.currency ?? 'IDR';

	return list
		.filter((item): item is GenericRecord => typeof item === 'object' && item !== null)
		.map((item) => {
			const sellPrice = item.price ?? item.sell;
			const buyback = item.buyback_price ?? item.buybackPrice ?? item.buy;
			const price = toPositiveNumber(sellPrice, 0);
			const buybackPriceRaw = toNumber(buyback, -1);

			return {
				...item,
				source: params.source,
				source_site: params.sourceSite ?? null,
				gold_type: String(item.gold_type ?? item.type ?? 'unknown'),
				weight: toPositiveNumber(item.weight, 1),
				weight_unit: String(item.weight_unit ?? item.unit ?? 'gram'),
				price,
				buyback_price: buybackPriceRaw >= 0 ? buybackPriceRaw : null,
				currency: String(item.currency ?? currency),
				recorded_at: recordedAt,
				meta: toMeta(item.meta ?? item.info),
			};
		});
}
