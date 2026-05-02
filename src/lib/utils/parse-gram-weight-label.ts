export interface GramWeightLabelParseResult {
	weight: string;
	weightUnit: string;
}

/**
 * Parses labels like `1 gram` or `1gram` into a numeric weight string and unit `gr`.
 */
export function parseGramWeightLabel(text: string): GramWeightLabelParseResult {
	const normalized = text.replace(/\s+/g, ' ').trim();
	const match = normalized.match(/^([\d.,]+)\s*gram$/i);
	if (!match) {
		return { weight: '', weightUnit: '' };
	}
	const num = Number(match[1].replace(',', '.'));
	if (!Number.isFinite(num)) {
		return { weight: '', weightUnit: '' };
	}
	return { weight: String(num), weightUnit: 'gr' };
}
