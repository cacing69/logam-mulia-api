import { describe, expect, it } from 'vitest';
import { normalizePriceRows } from '../../src/lib/utils/price-response';

describe('normalizePriceRows', () => {
	it('sets recordedDate on each row', () => {
		const rows = normalizePriceRows(
			[{ sellPrice: 100, buybackPrice: 90, materialType: 'Antam' }],
			{
				source: 'test',
				recordedDate: '2026-05-02',
				recordedAt: '2026-05-02T10:00:00.000Z',
			},
		);
		expect(rows).toHaveLength(1);
		expect(rows[0].recordedDate).toBe('2026-05-02');
		expect(rows[0].source).toBe('test');
		expect(rows[0].materialType).toBe('Antam');
	});
});
