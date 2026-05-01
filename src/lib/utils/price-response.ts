type GenericRecord = Record<string, unknown>;

export interface PriceRow {
	source: string;
	material: string;
	materialType: string;
	weight: number;
	weightUnit: string;
	sellPrice: number;
	buybackPrice: number | null;
	currency: string;
	createdAt: string;
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

export function normalizePriceRows(
	data: unknown,
	params: {
		source: string;
		currency?: string;
		recordedAt?: string | number;
	}
): PriceRow[] {
	const list = Array.isArray(data) ? data : [data];
	const currency = params.currency ?? 'IDR';
	const createdAt = params.recordedAt
		? new Date(params.recordedAt).toISOString()
		: new Date().toISOString();

	return list
		.filter((item): item is GenericRecord => typeof item === 'object' && item !== null)
		.map((item) => {
			const sellPrice = toPositiveNumber(item.sellPrice ?? item.price ?? item.sell, 0);
			const buyback = item.buybackPrice ?? item.buyback_price ?? item.buy;
			const buybackPriceRaw = toNumber(buyback, -1);

			return {
				...item,
				source: params.source,
				material: String(item.material ?? 'gold'),
				materialType: String(item.material_type ?? item.materialType ?? item.type ?? 'unknown'),
				weight: toPositiveNumber(item.weight, 1),
				weightUnit: String(item.weight_unit ?? item.weightUnit ?? 'gr'),
				sellPrice,
				buybackPrice: buybackPriceRaw >= 0 ? buybackPriceRaw : null,
				currency: String(item.currency ?? currency),
				createdAt: createdAt,
				meta: toMeta(item.meta ?? item.info),
			};
		});
}
