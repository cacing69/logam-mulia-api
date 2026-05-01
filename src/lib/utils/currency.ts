export function parseCurrency(value: string): number {
	const cleaned = value.replace(/[^\d,]/g, '').replace(',', '.');
	return parseFloat(cleaned) || 0;
}
