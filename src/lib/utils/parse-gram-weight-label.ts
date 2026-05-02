export interface GramWeightLabelParseResult {
	weight: string;
	weightUnit: string;
}

export interface ParseGramWeightLabelOptions {
	/** Default: /^([\\d.,]+)\\s*gram$/i — cocok untuk `1 gram` / `1gram`. */
	pattern?: RegExp;
	/** Satuan setelah angka ter-parse (default `gr`). */
	outputWeightUnit?: string;
}

/**
 * Parses labels like `1 gram` or `1gram` into a numeric weight string and unit `gr`.
 * Pola bisa di-override lewat `options.pattern` (mis. didefinisikan di config fitur).
 */
export function parseGramWeightLabel(
	text: string,
	options?: ParseGramWeightLabelOptions,
): GramWeightLabelParseResult {
	const pattern = options?.pattern ?? /^([\d.,]+)\s*gram$/i;
	const outputWeightUnit = options?.outputWeightUnit ?? 'gr';
	const normalized = text.replace(/\s+/g, ' ').trim();
	const match = normalized.match(pattern);
	if (!match) {
		return { weight: '', weightUnit: '' };
	}
	const num = Number(match[1].replace(',', '.'));
	if (!Number.isFinite(num)) {
		return { weight: '', weightUnit: '' };
	}
	return { weight: String(num), weightUnit: outputWeightUnit };
}
