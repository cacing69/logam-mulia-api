export function parseCurrency(value: string): number {
	const normalized = value.replace(/[^\d.,]/g, '');

	if (!normalized) {
		return 0;
	}

	const hasDot = normalized.includes('.');
	const hasComma = normalized.includes(',');

	if (hasDot && hasComma) {
		const lastDot = normalized.lastIndexOf('.');
		const lastComma = normalized.lastIndexOf(',');

		// Indonesian style: 1.500.000,50
		if (lastComma > lastDot) {
			return parseFloat(normalized.replace(/\./g, '').replace(',', '.')) || 0;
		}

		// US style: 1,500,000.50
		return parseFloat(normalized.replace(/,/g, '')) || 0;
	}

	if (hasComma) {
		const commaCount = (normalized.match(/,/g) ?? []).length;
		if (commaCount > 1) {
			// e.g. 2,566,000
			return parseFloat(normalized.replace(/,/g, '')) || 0;
		}

		const [left, right = ''] = normalized.split(',');
		if (right.length === 3) {
			// e.g. 2,566 (thousands separator)
			return parseFloat(`${left}${right}`) || 0;
		}

		// e.g. 2737,50 (decimal separator)
		return parseFloat(normalized.replace(',', '.')) || 0;
	}

	if (hasDot) {
		const dotCount = (normalized.match(/\./g) ?? []).length;
		if (dotCount > 1) {
			// e.g. 2.566.000
			return parseFloat(normalized.replace(/\./g, '')) || 0;
		}

		const [left, right = ''] = normalized.split('.');
		if (right.length === 3) {
			// e.g. 10.000 (thousands separator)
			return parseFloat(`${left}${right}`) || 0;
		}
	}

	return parseFloat(normalized) || 0;
}
