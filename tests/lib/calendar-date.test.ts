import { describe, expect, it } from 'vitest';
import { jakartaCalendarDateString, utcCalendarDateString } from '../../src/lib/utils/calendar-date';

describe('calendar-date', () => {
	it('utcCalendarDateString returns YYYY-MM-DD', () => {
		const d = new Date('2026-05-02T12:00:00.000Z');
		expect(utcCalendarDateString(d)).toBe('2026-05-02');
	});

	it('jakartaCalendarDateString returns en-CA date in Asia/Jakarta', () => {
		const d = new Date('2026-05-02T16:00:00.000Z');
		expect(jakartaCalendarDateString(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});
});
