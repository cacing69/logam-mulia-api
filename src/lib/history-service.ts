import { createClient } from '@libsql/client';

type HistoryEnv = {
	TURSO_DATABASE_URL?: string;
	TURSO_AUTH_TOKEN?: string;
};

export interface HistoryItem {
	source: string;
	material: string;
	materialType: string;
	weight: number;
	weightUnit: string;
	sellPrice: number;
	buybackPrice: number | null;
	currency: string;
	/** Tanggal bisnis `YYYY-MM-DD` (Asia/Jakarta). */
	recordedDate: string;
	createdAt: string;
}

export interface HistoryResponse {
	success: boolean;
	data?: HistoryItem[];
	pagination?: {
		page: number;
		length: number;
		total: number;
		totalPages: number;
	};
	error?: string;
	statusCode?: number;
}

export interface HistoryFilters {
	weight?: number;
	materialType?: string;
}

export interface HistoryQueryParams {
	page?: string;
	length?: string;
	weight?: string;
	materialType?: string;
}

function parseUnsignedInt(
	raw: string | undefined,
	fieldName: 'page' | 'length',
	defaultValue: number
): { ok: true; value: number } | { ok: false; error: string } {
	if (raw === undefined || raw === '') {
		return { ok: true, value: defaultValue };
	}

	if (!/^\d+$/.test(raw)) {
		return { ok: false, error: `${fieldName} must be an unsigned integer` };
	}

	const value = Number.parseInt(raw, 10);
	if (!Number.isSafeInteger(value) || value <= 0) {
		return { ok: false, error: `${fieldName} must be a positive unsigned integer` };
	}

	return { ok: true, value };
}

export function normalizePagination(pageRaw?: string, lengthRaw?: string): {
	ok: true;
	page: number;
	length: number;
	offset: number;
} | {
	ok: false;
	error: string;
} {
	const pageParsed = parseUnsignedInt(pageRaw, 'page', 1);
	if (!pageParsed.ok) {
		return { ok: false, error: pageParsed.error };
	}

	const lengthParsed = parseUnsignedInt(lengthRaw, 'length', 20);
	if (!lengthParsed.ok) {
		return { ok: false, error: lengthParsed.error };
	}

	const page = pageParsed.value;
	const length = Math.min(1000, lengthParsed.value);
	return {
		ok: true,
		page,
		length,
		offset: (page - 1) * length,
	};
}

function normalizeFilters(weightRaw?: string, materialTypeRaw?: string): { ok: true; filters: HistoryFilters } | { ok: false; error: string } {
	const filters: HistoryFilters = {};

	if (weightRaw !== undefined && weightRaw !== '') {
		if (!/^\d+(\.\d+)?$/.test(weightRaw)) {
			return { ok: false, error: 'weight must be a positive number' };
		}
		const weight = Number.parseFloat(weightRaw);
		if (!Number.isFinite(weight) || weight <= 0) {
			return { ok: false, error: 'weight must be a positive number' };
		}
		filters.weight = weight;
	}

	if (materialTypeRaw !== undefined && materialTypeRaw !== '') {
		filters.materialType = materialTypeRaw.trim();
	}

	return { ok: true, filters };
}

export async function getHistoryBySource(
	env: HistoryEnv,
	source: string,
	query: HistoryQueryParams = {},
): Promise<HistoryResponse> {
	const pagination = normalizePagination(query.page, query.length);
	if (!pagination.ok) {
		return {
			success: false,
			error: pagination.error,
			statusCode: 400,
		};
	}

	const { page, length, offset } = pagination;
	const filtersParsed = normalizeFilters(query.weight, query.materialType);
	if (!filtersParsed.ok) {
		return {
			success: false,
			error: filtersParsed.error,
			statusCode: 400,
		};
	}
	const filters = filtersParsed.filters;

	if (!env.TURSO_DATABASE_URL || !env.TURSO_AUTH_TOKEN) {
		return {
			success: false,
			error: 'Turso credentials are missing',
			statusCode: 500,
		};
	}

	try {
		const client = createClient({
			url: env.TURSO_DATABASE_URL,
			authToken: env.TURSO_AUTH_TOKEN,
		});

		const conditions: string[] = ['source = ?'];
		const whereArgs: (string | number)[] = [source];

		if (filters.weight !== undefined) {
			conditions.push('weight = ?');
			whereArgs.push(filters.weight);
		}
		if (filters.materialType !== undefined) {
			conditions.push('material_type = ?');
			whereArgs.push(filters.materialType);
		}

		const whereClause = conditions.join(' AND ');

		const countResult = await client.execute({
			sql: `SELECT COUNT(*) AS total FROM price_history WHERE ${whereClause}`,
			args: whereArgs,
		});
		const total = Number(countResult.rows[0]?.total ?? 0);

		const rowsResult = await client.execute({
			sql: `
				SELECT source, material, material_type, weight, weight_unit, sell_price, buyback_price, currency, recorded_date, created_at
				FROM price_history
				WHERE ${whereClause}
				ORDER BY recorded_date DESC, datetime(created_at) DESC
				LIMIT ? OFFSET ?
			`,
			args: [...whereArgs, length, offset],
		});

		const data: HistoryItem[] = rowsResult.rows.map((row) => ({
			source: String(row.source ?? source),
			material: String(row.material ?? 'gold'),
			materialType: String(row.material_type ?? 'unknown'),
			weight: Number(row.weight ?? 1),
			weightUnit: String(row.weight_unit ?? 'gr'),
			sellPrice: Number(row.sell_price ?? 0),
			buybackPrice: row.buyback_price === null ? null : Number(row.buyback_price),
			currency: String(row.currency ?? 'IDR'),
			recordedDate: String(row.recorded_date ?? ''),
			createdAt: String(row.created_at ?? ''),
		}));

		return {
			success: true,
			data,
			pagination: {
				page,
				length,
				total,
				totalPages: total === 0 ? 0 : Math.ceil(total / length),
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error',
			statusCode: 500,
		};
	}
}
